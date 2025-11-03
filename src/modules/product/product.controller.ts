import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { Product } from './entities/product.entity';
import { LoggingPerformanceInterceptor } from '../../common/interceptors/logging-performance.interceptor';
import { ExcludeNullInterceptor } from '../../common/interceptors/exclude-null.interceptor';
import { ErrorsInterceptor } from '../../common/interceptors/errors.interceptor';
import { RedisCachingInterceptor } from '../../common/interceptors/redis-caching.interceptor';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { Auth, LogExecution, CacheTTL } from '../../common/decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product
   * @param createProductDto CreateProductDto
   * @returns Promise<Product>
   */
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @Auth('admin')
  create(@Body(new TrimPipe()) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * Find all products
   * @returns Promise<Product[]>
   */
  @ApiBearerAuth('JWT-auth')
  @Get()
  @Auth('admin', 'user')
  @UseInterceptors(
    ClassSerializerInterceptor,
    TransformInterceptor<Product>,
    LoggingPerformanceInterceptor,
    RedisCachingInterceptor,
  )
  @LogExecution(false)
  @CacheTTL(60)
  findAll(
    @UserDecorator('roles') roles: string[],
    @UserDecorator('id') id: number,
  ) {
    if (roles.includes('admin')) {
      return this.productService.findAll();
    } else {
      return this.productService.findByUserId(id);
    }
  }

  /**
   * Find product by ID
   * @param id string
   * @returns Promise<Product>
   */
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @CacheTTL(60)
  @UseInterceptors(
    LoggingPerformanceInterceptor,
    ExcludeNullInterceptor,
    ErrorsInterceptor,
    RedisCachingInterceptor,
  )
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Update product by ID
   * @param id string
   * @param updateProductDto UpdateProductDto
   * @returns Promise<Product>
   */
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Remove product by ID
   * @param id string
   * @returns Promise<void>
   */
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
