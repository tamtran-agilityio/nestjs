/**
 * @description: Response transformation interceptor
 * This interceptor standardizes the structure of API responses.
 * It wraps the original response data into a consistent format
 * that includes the data, a message, and the HTTP status code.
 */
import { Injectable, NestInterceptor } from '@nestjs/common';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './respone.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
      })),
    );
  }
}
