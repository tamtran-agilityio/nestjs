import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/demo'),
    ConfigModule,
    AuthModule,
    UsersModule,
    CatsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

