# Common Exception Handling System

## Overview
This system provides centralized exception handling across all modules in your NestJS application.

## Components Created:

### 1. Custom Exception Classes (`src/common/exceptions/custom.exceptions.ts`)
- `DuplicateEntityException` - For duplicate entity errors
- `EntityNotFoundException` - For not found errors
- `InvalidCredentialsException` - For authentication errors
- `AccessDeniedException` - For authorization errors
- `ValidationException` - For validation errors

### 2. Database Error Mapper (`src/common/exceptions/database-error.mapper.ts`)
Maps PostgreSQL error codes to user-friendly messages with field extraction.

### 3. Global Exception Filter (`src/common/filters/global-exception.filter.ts`)
Catches all exceptions and formats them consistently.

### 4. Exception Service (`src/common/exceptions/exception.service.ts`)
Provides utility methods for throwing common exceptions.

## Usage Examples:

### In any Service:
```typescript
import { Injectable } from '@nestjs/common';
import { ExceptionService } from '../../common/exceptions/exception.service';

@Injectable()
export class SomeService {
  constructor(
    private readonly exceptionService: ExceptionService,
  ) {}

  async findById(id: number) {
    const entity = await this.repository.findOne(id);
    // Throws EntityNotFoundException if not found
    return this.exceptionService.ensureEntityExists(entity, 'EntityName', id);
  }

  async create(dto: CreateDto) {
    const existing = await this.repository.findByEmail(dto.email);
    // Throws DuplicateEntityException if exists
    this.exceptionService.ensureNoDuplicate(!!existing, 'email', dto.email);
    
    return this.repository.save(dto);
  }

  async validateUser(credentials: LoginDto) {
    const user = await this.findByCredentials(credentials);
    if (!user) {
      this.exceptionService.throwInvalidCredentials();
    }
    return user;
  }
}
```

### Manual Exception Throwing:
```typescript
// Direct exception throwing
this.exceptionService.throwEntityNotFound('User', 123);
this.exceptionService.throwDuplicateEntity('email', 'user@example.com');
this.exceptionService.throwAccessDenied('admin resources');
this.exceptionService.throwValidationError(['Field is required', 'Invalid format']);
```

## Error Response Format:

### Database Duplicate Error:
```json
{
  "statusCode": 409,
  "message": "The field \"email\" already exists",
  "timestamp": "2024-10-24T10:30:45.123Z",
  "path": "/users",
  "method": "POST",
  "field": "email",
  "detail": "Key (\"email\")=(user@example.com) already exists.", // dev only
  "constraint": "users_email_key" // dev only
}
```

### Entity Not Found:
```json
{
  "statusCode": 404,
  "message": "User with id '123' not found",
  "timestamp": "2024-10-24T10:30:45.123Z",
  "path": "/users/123",
  "method": "GET"
}
```

### Custom Validation Error:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Email is required", "Password too short"],
  "timestamp": "2024-10-24T10:30:45.123Z",
  "path": "/users",
  "method": "POST"
}
```

## Benefits:
- **Consistent error responses** across all modules
- **Automatic database error handling** with field extraction
- **User-friendly messages** instead of raw database errors
- **Development vs Production** error detail levels
- **Centralized logging** with structured data
- **Easy to use utility methods** for common scenarios
- **Type-safe exception handling**

## Supported Database Error Codes:
- `23505` - Unique constraint violation (duplicates)
- `23503` - Foreign key violation
- `23514` - Check constraint violation
- `23502` - Not null violation
- `22001` - String data too long
- `22003` - Numeric value out of range