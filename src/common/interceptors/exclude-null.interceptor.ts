import { Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: any, next: any): Observable<any> {
    return next.handle().pipe(map((data: any) => this.excludeNulls(data)));
  }

  private excludeNulls(data: any): any {
    if (Array.isArray(data)) {
      return data.filter((item) => item !== null && item !== undefined);
    }
    return data !== null && data !== undefined ? data : null;
  }
}
