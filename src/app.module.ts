import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CqrsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
