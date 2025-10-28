import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEntityException extends HttpException {
  constructor(field: string, value: string) {
    super(
      {
        message: `${field} '${value}' already exists`,
        error: 'Duplicate Entry',
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, id: string | number) {
    super(
      {
        message: `${entityName} with id '${id}' not found`,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid credentials provided',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AccessDeniedException extends HttpException {
  constructor(resource?: string) {
    super(
      {
        message: resource ? `Access denied to ${resource}` : 'Access denied',
        error: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super(
      {
        message: 'Validation failed',
        errors,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
