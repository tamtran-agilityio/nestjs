import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('DATABASE_URL');
        return url
          ? {
            type: 'postgres',
            url,
            autoLoadEntities: true,
            synchronize: false, // keep OFF in prod; use migrations
            ssl: false,         // set true + proper options if needed in prod
          }
          : {
            type: 'postgres',
            host: cfg.get('DB_HOST'),
            port: cfg.get<number>('DB_PORT'),
            username: cfg.get('DB_USER'),
            password: cfg.get('DB_PASSWORD'),
            database: cfg.get('DB_NAME'),
            autoLoadEntities: true,
            synchronize: false,
          };
      },
      inject: [ConfigService],
    }),
    CqrsModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
