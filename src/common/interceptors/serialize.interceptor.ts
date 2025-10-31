import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(protected dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        // Handle arrays of objects
        if (Array.isArray(data)) {
          return data.map((item) =>
            plainToClass(this.dto, item, { excludeExtraneousValues: true }),
          );
        }

        // Handle single objects
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}

// Helper function to create interceptor instances
export function SerializeWith<T>(dto: ClassConstructor<T>) {
  return new SerializeInterceptor(dto);
}
