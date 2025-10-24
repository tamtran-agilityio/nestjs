// src/common/filters/typeorm-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();// Or customize based on the error code

    // You can inspect exception.driverError for more details about the database error
    // and tailor the message accordingly.
    let message = '';
    let status = HttpStatus.BAD_REQUEST;
    if (exception.name === 'QueryFailedError') {
        const driverError: any = exception.driverError;
        message = driverError.detail || driverError.message || driverError;
    }

    response.status(status).json({
      statusCode: status,
      message: message
    });
  }
}