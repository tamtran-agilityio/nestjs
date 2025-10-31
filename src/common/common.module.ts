import { Module, Global } from '@nestjs/common';
import { ExceptionService } from './exceptions/exception.service';
import { CacheModule } from './interceptors/cache/cache.module';

@Global()
@Module({
  providers: [ExceptionService],
  exports: [ExceptionService],
  imports: [CacheModule],
})
export class CommonModule {}
