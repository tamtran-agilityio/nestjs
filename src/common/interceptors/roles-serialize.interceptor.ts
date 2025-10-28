import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SerializeInterceptor } from './serialize.interceptor';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class RolesSerializeInterceptor<T> extends SerializeInterceptor<T> {
  constructor(dto: new () => T) {
    super(dto);
  }

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const roles = request.user?.roles || ['user']; // fallback to ['user']

    return handler.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          groups: roles.includes('admin') ? ['admin'] : [],
        });
      }),
    );
  }
}

// Helper function to create interceptor instances
export function SerializeWith<T>(dto: ClassConstructor<T>) {
  return new RolesSerializeInterceptor(dto);
}
