import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { SecretProvider } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';

// AuthModule with dynamic configuration for JWT
@Module({})
export class AuthModule {
  static forRoot(options: {
    secret: string;
    expiresIn: number;
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          secret: options.secret,
          signOptions: { expiresIn: options.expiresIn },
        }),
        UsersModule,
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, SecretProvider, JwtStrategy, AuthResolver],
      exports: [AuthService, PassportModule],
    };
  }
}
