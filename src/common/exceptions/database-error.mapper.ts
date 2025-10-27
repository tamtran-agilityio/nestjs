import { HttpStatus } from '@nestjs/common';

export interface ErrorMapping {
  status: HttpStatus;
  message: string;
  extractField?: (detail: string) => string | null;
}

export class DatabaseErrorMapper {
  private static readonly ERROR_MAPPINGS: Record<string, ErrorMapping> = {
    // PostgreSQL error codes
    '23505': {  // unique_violation
      status: HttpStatus.CONFLICT,
      message: 'Duplicate entry',
      extractField: (detail: string) => {
        const match = detail.match(/Key \("([^"]+)"\)/);
        return match ? match[1] : null;
      }
    },
    '23503': {  // foreign_key_violation
      status: HttpStatus.BAD_REQUEST,
      message: 'Invalid reference to related data',
      extractField: (detail: string) => {
        const match = detail.match(/Key \(([^)]+)\)/);
        return match ? match[1] : null;
      }
    },
    '23514': {  // check_violation
      status: HttpStatus.BAD_REQUEST,
      message: 'Data violates check constraint',
    },
    '23502': {  // not_null_violation
      status: HttpStatus.BAD_REQUEST,
      message: 'Required field is missing',
      extractField: (detail: string) => {
        const match = detail.match(/column "([^"]+)"/);
        return match ? match[1] : null;
      }
    },
    '22001': {  // string_data_right_truncation
      status: HttpStatus.BAD_REQUEST,
      message: 'Data too long for field',
    },
    '22003': {  // numeric_value_out_of_range
      status: HttpStatus.BAD_REQUEST,
      message: 'Numeric value out of range',
    },
  };

  static mapError(code: string, detail?: string, constraint?: string) {
    const mapping = this.ERROR_MAPPINGS[code];
    if (!mapping) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error occurred',
        field: null,
      };
    }

    let field: string | null = null;
    let message = mapping.message;

    if (detail && mapping.extractField) {
      field = mapping.extractField(detail);
      if (field && code === '23505') {
        message = `The field "${field}" already exists`;
      } else if (field && code === '23502') {
        message = `The field "${field}" is required`;
      }
    }

    return {
      status: mapping.status,
      message,
      field,
      detail: process.env.NODE_ENV !== 'production' ? detail : undefined,
      constraint: process.env.NODE_ENV !== 'production' ? constraint : undefined,
    };
  }
}