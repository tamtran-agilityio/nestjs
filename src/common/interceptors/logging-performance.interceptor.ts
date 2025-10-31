import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingPerformanceInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    console.log(`Incoming Request: ${method} ${url}`);
    const result = await next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        console.log(`Request ${method} ${url} completed in ${elapsed}ms`);
      }),
    );
    return result;
  }
}
