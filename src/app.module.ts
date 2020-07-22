import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsModule } from './cats/cats.module';
import { ConfigModule } from './config/config.module';
import { logger } from './common/logger.middleware'

@Module({
  imports: [CatsModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(logger)
  //     .forRoutes('cats')
  // }
}
