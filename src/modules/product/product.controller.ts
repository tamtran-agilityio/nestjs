import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { Product } from './entities/product.entity';
import { LoggingPerformanceInterceptor } from 'src/common/interceptors/logging-performance.interceptor';
import { ExcludeNullInterceptor } from 'src/common/interceptors/exclude-null.interceptor';
import { ErrorsInterceptor } from 'src/common/interceptors/errors.interceptor';
import { TrimPipe } from 'src/common/pipes/trim.pipe';

@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(['admin'])
  create(@Body(new TrimPipe()) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Roles(['admin', 'user'])
  @UseInterceptors(
    ClassSerializerInterceptor,
    TransformInterceptor<Product>,
    LoggingPerformanceInterceptor,
  )
  findAll(@Request() req) {
    return this.productService.findAll();
  }

  @Get(':id')
  @UseInterceptors(
    LoggingPerformanceInterceptor,
    ExcludeNullInterceptor,
    ErrorsInterceptor,
  )
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
