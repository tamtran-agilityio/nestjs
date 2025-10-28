import { Injectable } from '@nestjs/common';
import {
  DuplicateEntityException,
  EntityNotFoundException,
  InvalidCredentialsException,
  AccessDeniedException,
  ValidationException,
} from './custom.exceptions';

@Injectable()
export class ExceptionService {
  throwDuplicateEntity(field: string, value: string): never {
    throw new DuplicateEntityException(field, value);
  }

  throwEntityNotFound(entityName: string, id: string | number): never {
    throw new EntityNotFoundException(entityName, id);
  }

  throwInvalidCredentials(): never {
    throw new InvalidCredentialsException();
  }

  throwAccessDenied(resource?: string): never {
    throw new AccessDeniedException(resource);
  }

  throwValidationError(errors: string[]): never {
    throw new ValidationException(errors);
  }

  // Utility method to check if entity exists, throw if not
  ensureEntityExists<T>(
    entity: T | null | undefined,
    entityName: string,
    id: string | number,
  ): T {
    if (!entity) {
      this.throwEntityNotFound(entityName, id);
    }
    return entity;
  }

  // Utility method to check for duplicates
  ensureNoDuplicate(exists: boolean, field: string, value: string): void {
    if (exists) {
      this.throwDuplicateEntity(field, value);
    }
  }
}
