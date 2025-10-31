import { Module, Global } from '@nestjs/common';
import { ExceptionService } from './exceptions/exception.service';

@Global()
@Module({
  providers: [ExceptionService],
  exports: [ExceptionService],
})
export class CommonModule {}
