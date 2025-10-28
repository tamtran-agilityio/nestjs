import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';
import { DatabaseErrorMapper } from '../exceptions/database-error.mapper';

interface PostgresError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {
      statusCode: status,
      message,
      timestamp,
      path,
      method,
    };

    // Handle TypeORM QueryFailedError (Database errors)
    if (exception instanceof QueryFailedError) {
      const dbError = this.handleDatabaseError(exception);
      errorResponse = { ...errorResponse, ...dbError };
      this.logger.error(`Database Error: ${dbError.message}`, {
        code: (exception.driverError as PostgresError)?.code,
        detail: (exception.driverError as PostgresError)?.detail,
        query: exception.query,
        path,
        method,
      });
    }
    // Handle HTTP Exceptions
    else if (exception instanceof HttpException) {
      const httpError = this.handleHttpException(exception);
      errorResponse = { ...errorResponse, ...httpError };
      this.logger.warn(`HTTP Exception: ${httpError.message}`, {
        statusCode: httpError.statusCode,
        path,
        method,
      });
    }
    // Handle unknown errors
    else if (exception instanceof Error) {
      errorResponse.message = exception.message || message;
      this.logger.error(`Unhandled Error: ${exception.message}`, {
        stack: exception.stack,
        path,
        method,
      });
    }
    // Handle any other type of exception
    else {
      this.logger.error('Unknown Exception Type', {
        exception: String(exception),
        path,
        method,
      });
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleDatabaseError(exception: QueryFailedError) {
    const pgError = exception.driverError as PostgresError;
    const code = pgError.code;
    const detail = pgError.detail;
    const constraint = pgError.constraint;

    if (code) {
      const mappedError = DatabaseErrorMapper.mapError(
        code,
        detail,
        constraint,
      );
      return {
        statusCode: mappedError.status,
        message: mappedError.message,
        field: mappedError.field,
        ...(mappedError.detail && { detail: mappedError.detail }),
        ...(mappedError.constraint && { constraint: mappedError.constraint }),
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Database operation failed',
    };
  }

  private handleHttpException(exception: HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse();

    if (typeof response === 'object' && response !== null) {
      return {
        statusCode: status,
        ...(response as object),
      };
    }

    return {
      statusCode: status,
      message: response?.toString() || 'HTTP Exception',
    };
  }
}
