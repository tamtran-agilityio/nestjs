import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import postgresConfig from './config/postgres.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [postgresConfig], }),
    // Configure TypeORM with the postgres config
    TypeOrmModule.forRootAsync({
      useFactory: postgresConfig,
    }),
    CqrsModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
