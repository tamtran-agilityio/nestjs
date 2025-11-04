import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CommonModule } from './common/common.module';
import { ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import corsConfig from './config/cors.config';
import redisConfig from './config/redis.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SharedModule } from './shared/shared.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, corsConfig, redisConfig],
    }),
    // Configure TypeORM with the postgres config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database')!,
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore({
        host: redisConfig().host,
        port: redisConfig().port,
        ttl: redisConfig().ttl,
      }),
    }),
    CqrsModule,
    CommonModule,
    UsersModule,
    // Configure AuthModule with dynamic JWT settings
    AuthModule.forRoot({
      secret: authConfig().secret,
      expiresIn: authConfig().expiresIn,
    }),
    ProductModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
