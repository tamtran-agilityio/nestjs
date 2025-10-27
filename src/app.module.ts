import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig],
    }),
    // Configure TypeORM with the postgres config
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    CqrsModule,
    CommonModule,
    UsersModule,
    // Configure AuthModule with dynamic JWT settings
    AuthModule.forRoot({
      secret: authConfig().secret,
      expiresIn: authConfig().expiresIn
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
