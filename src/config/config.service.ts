import { Injectable } from '@nestjs/common';
import {
  DatabaseConfig,
  AuthConfig,
  CorsConfig,
  AppConfig,
} from './config.interface';

@Injectable()
export class ConfigService {
  getDatabaseConfig(): DatabaseConfig {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'app_db',
    };
  }

  getAuthConfig(): AuthConfig {
    return {
      secret: process.env.JWT_SECRET || 'defaultSecret',
      expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
    };
  }

  getCorsConfig(): CorsConfig {
    const originsString =
      process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001';
    const origins = originsString.split(',').map((origin) => origin.trim());

    return {
      origins,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: process.env.CORS_METHODS?.split(',') || [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
        'Content-Type',
        'Authorization',
      ],
      exposedHeaders: process.env.CORS_EXPOSED_HEADERS?.split(',') || [
        'Content-Length',
        'X-Request-Id',
      ],
      maxAge: parseInt(process.env.CORS_MAX_AGE || '86400', 10),
    };
  }

  getAppConfig(): AppConfig {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }

  // Utility methods for easy access
  get isDevelopment(): boolean {
    return this.getAppConfig().nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.getAppConfig().nodeEnv === 'production';
  }

  getRedisConfig() {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      ttl: parseInt(process.env.REDIS_TTL || '30', 10),
    };
  }
}
