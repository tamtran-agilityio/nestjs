import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService as CustomConfigService } from './config.service';
import databaseConfig from './database.config';
import authConfig from './auth.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig],
      envFilePath: 'env/.env.development',
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class ConfigModules {}
