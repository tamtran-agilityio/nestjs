import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RedisCachingInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ttl = this.reflector.get<number>(
      'custom:cacheTTL',
      context.getHandler(),
    );
    if (!ttl) return next.handle();

    const request = context.switchToHttp().getRequest();
    const key = `cache:${request.url}`;

    const cached = await this.cacheManager.get(key);
    if (cached) {
      console.log('Redis cache hit:', key);
      return of(cached);
    }

    return next.handle().pipe(
      tap(async (data) => {
        console.log('Caching in Redis:', key);
        await this.cacheManager.set(key, data, ttl * 1000);
      }),
    );
  }
}
