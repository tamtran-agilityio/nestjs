import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import authConfig from '../../config/auth.config';
import { UserRepository } from './user.repository';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: authConfig().secret,
      signOptions: { expiresIn: authConfig().expiresIn },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UsersResolver],
  exports: [UsersService, TypeOrmModule, UserRepository],
})
export class UsersModule {}
