import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GqlLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getContext();
    const parentType = info.parentType?.name || 'UnknownType';
    const fieldName = info.fieldName || 'UnknownField';
    const startTime = Date.now();
    console.log(`[GQL] ${JSON.stringify(info)} - Start`);

    return next.handle().pipe(
      tap({
        next: (result) => {
          const duration = Date.now() - startTime;
          if (!result) {
            console.warn(
              `[GQL] ${parentType}.${fieldName} - No result returned`,
            );
            return;
          }
          console.log(`[GQL] ${parentType}.${fieldName} - ${duration}ms`);
        },
        error: (error) => {
          console.error(`[GQL] ${parentType}.${fieldName} - Error:`, error);
        },
      }),
    );
  }
}
