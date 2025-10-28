# Origin Config Module Usage Guide

## Overview
The config module provides centralized configuration management for CORS origins and other application settings.

## Configuration Structure

### Environment Variables (.env)
```bash
# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:4000
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
CORS_EXPOSED_HEADERS=Content-Length,X-Request-Id,X-Total-Count
CORS_MAX_AGE=86400

# App Configuration
PORT=3000
NODE_ENV=development
```

## Usage in Code

### 1. Using ConfigService (Recommended)
```typescript
import { ConfigService } from './config/config.service';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const corsConfig = this.configService.getCorsConfig();
    const appConfig = this.configService.getAppConfig();
    
    console.log('Allowed origins:', corsConfig.origins);
    console.log('App port:', appConfig.port);
    console.log('Is development:', this.configService.isDevelopment);
  }
}
```

### 2. Using @nestjs/config (Alternative)
```typescript
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private configService: NestConfigService) {}

  someMethod() {
    const origins = this.configService.get('cors.origins');
    const port = this.configService.get('app.port');
  }
}
```

### 3. In main.ts (Bootstrap)
```typescript
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Get config service instance
  const configService = app.get(ConfigService);
  const corsConfig = configService.getCorsConfig();
  const appConfig = configService.getAppConfig();

  // Enable CORS with configuration
  app.enableCors({
    origin: corsConfig.origins,
    credentials: corsConfig.credentials,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
    exposedHeaders: corsConfig.exposedHeaders,
    maxAge: corsConfig.maxAge,
  });

  await app.listen(appConfig.port);
  console.log(`🚀 Application is running on: http://localhost:${appConfig.port}`);
  console.log(`🌐 CORS Origins: ${corsConfig.origins.join(', ')}`);
}
```

## Configuration Interfaces

```typescript
export interface CorsConfig {
  origins: string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
}
```

## Available Methods

### ConfigService Methods:
- `getDatabaseConfig()` - Database connection settings
- `getAuthConfig()` - JWT authentication settings  
- `getCorsConfig()` - CORS origin and headers configuration
- `getAppConfig()` - Application port and environment
- `isDevelopment` - Boolean for development environment
- `isProduction` - Boolean for production environment

## Environment-Specific Configuration

### Development (.env.development)
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
NODE_ENV=development
PORT=3000
```

### Production (.env.production)
```bash
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
NODE_ENV=production
PORT=8080
```

### Testing (.env.test)
```bash
CORS_ORIGINS=http://localhost:3000
NODE_ENV=test
PORT=3001
```

## Dynamic Origin Configuration

### Allow Multiple Subdomains
```typescript
getCorsConfig(): CorsConfig {
  const originsString = process.env.CORS_ORIGINS || 'http://localhost:3000';
  let origins: (string | RegExp)[] = originsString.split(',').map(origin => origin.trim());
  
  // Allow all subdomains in development
  if (this.isDevelopment) {
    origins.push(/^http:\/\/localhost:\d+$/);
  }
  
  // Allow production domains and subdomains
  if (this.isProduction) {
    origins.push(/^https:\/\/.*\.yourdomain\.com$/);
  }

  return {
    origins,
    // ... rest of config
  };
}
```

### Conditional Configuration
```typescript
getCorsConfig(): CorsConfig {
  const baseConfig = {
    credentials: true,
    maxAge: 86400,
  };

  if (this.isDevelopment) {
    return {
      ...baseConfig,
      origins: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'], // Allow all headers in development
    };
  }

  return {
    ...baseConfig,
    origins: process.env.CORS_ORIGINS?.split(',') || [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for configuration
2. **Default Values**: Provide sensible defaults for development
3. **Type Safety**: Use TypeScript interfaces for configuration objects
4. **Validation**: Validate configuration values on startup
5. **Security**: Be restrictive with CORS origins in production

## Troubleshooting

1. **CORS Errors**: Check that your frontend origin is in CORS_ORIGINS
2. **Invalid Origins**: Ensure no trailing slashes in origin URLs
3. **Environment Not Loading**: Check .env file path and NODE_ENV setting
4. **Type Errors**: Ensure config interfaces match your usage