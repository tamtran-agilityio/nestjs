import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CacheTTL } from 'src/common/decorators/cache-ttl.decorator';
import { LogExecution } from 'src/common/decorators/log-execution.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GqlRolesGuard } from 'src/common/guards/gql-roles.guard';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productService: ProductService) {}

  @LogExecution(false)
  @Query(() => [Product], { name: 'products' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('admin')
  @CacheTTL(60)
  async findAll(): Promise<Product[] | null> {
    return this.productService.findAll();
  }

  @Query(() => [Product], { name: 'product' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: CreateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, input);
  }

  @Mutation(() => Product)
  async deleteProduct(
    @Args('id', { type: () => String }) id: string,
  ): Promise<void> {
    return this.productService.remove(id);
  }
}
