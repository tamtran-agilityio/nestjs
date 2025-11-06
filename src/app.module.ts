import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { GqlAuthGuard } from './common/guards/gql-auth.guard';
import { GqlRolesGuard } from './common/guards/gql-roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CommonModule } from './common/common.module';
import { ConfigService } from '@nestjs/config';
import { ConfigModules } from './config/config.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import corsConfig from './config/cors.config';
import redisConfig from './config/redis.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { GraphQLLoggingPlugin } from './common/plugins/graphql-logging.plugin';
import { SharedModule } from './shared/shared.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { HealthModule } from './modules/health/health.module';
import { TrimDirectiveTransformer } from './common/pipes/trim-directive.transformer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, corsConfig, redisConfig],
    }),
    ConfigModules,
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
    // Configure JwtModule globally for guards
    JwtModule.register({
      global: true,
      secret: authConfig().secret,
      signOptions: { expiresIn: authConfig().expiresIn },
    }),
    UsersModule,
    // Configure AuthModule with dynamic JWT settings
    AuthModule.forRoot({
      secret: authConfig().secret,
      expiresIn: authConfig().expiresIn,
    }),
    ProductModule,
    // SharedModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      include: [UsersModule, ProductModule, AuthModule],
      plugins: [new GraphQLLoggingPlugin()],
      formatError: (err) => {
        console.error('[GraphQL Error]', err);
        return err;
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx) => {
            const token = (
              ctx.connectionParams?.Authorization as string
            )?.replace(/^Bearer\s+/i, '');
            (ctx.extra as any).token = token;
          },
        },
      },
      context: ({ req, extra }) => ({ req, extra }),
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GraphQLLoggingPlugin,
    { provide: APP_GUARD, useClass: GqlAuthGuard }, // auth first
    { provide: APP_GUARD, useClass: GqlRolesGuard }, // then roles
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/graphql') // Exclude GraphQL endpoint from HTTP logging
      .forRoutes('*');
  }
}
