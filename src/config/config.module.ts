import { Module, DynamicModule } from '@nestjs/common'
import { ConfigService } from './services/config.service'
const CONFIG_OPTIONS = 'CONFIG_OPTIONS'

export interface ConfigModuleOptions {
  folder: string
}

@Module({})
export class ConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options
        },
        ConfigService
      ],
      exports: [ConfigService]
    }
  }
}
