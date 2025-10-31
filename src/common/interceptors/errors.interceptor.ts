import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExceptionService } from '../exceptions/exception.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly exceptionService: ExceptionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const mappedException = this.exceptionService.mapException(error);
        return throwError(mappedException);
      }),
    );
  }
}
