import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoggingPerformanceInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const logExecution = this.reflector.get<boolean>(
      'custom:logExecution',
      context.getHandler(),
    );
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    console.log(`Incoming Request logExecution: ${logExecution}`);

    const result = await next.handle().pipe(
      tap(() => {
        if (!logExecution) {
          const elapsed = Date.now() - now;
          console.log(`Request ${method} ${url} completed in ${elapsed}ms`);
        }
      }),
    );
    return result;
  }
}
