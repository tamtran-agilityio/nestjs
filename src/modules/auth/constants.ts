import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const SECRET_KEY = process.env.JWT_SECRET || '';

export const SecretProvider: Provider = {
  provide: SECRET_KEY,
  useFactory: (configService: ConfigService) => {
    return configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
  },
  inject: [ConfigService],
};
