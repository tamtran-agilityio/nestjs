import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductService } from './interfaces/product-service.interface';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { IProduct } from './interfaces/product.interface';
import { buildPaginationOptions } from '../../shared/utils/pagination.util';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  /**
   * Create a new product
   * @param createProductDto CreateProductDto
   * @returns Promise<Product>
   */
  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  /**
   * Find all products
   * @returns Promise<Product[]>
   */
  async findAll(): Promise<IProduct[]> {
    return this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find all products with pagination
   * @param pagination PaginationDto
   * @returns Promise with paginated products
   */
  async findAllPaginated(
    pagination: PaginationDto,
  ): Promise<{
    products: Product[];
    meta: { total: number; page: number; lastPage: number };
  }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    console.log('Total products:', data);

    return {
      products: data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find product by user ID owner
   * @param userId number
   * @returns
   */
  async findByUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
    pagination: PaginationDto,
  ) {
    console.log('Fetching products for user ID:', userId);
    const { page = 1, limit = 10 } = pagination;
    const [products, total] = await this.productRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      ...buildPaginationOptions(page - 1, limit),
    });
    
    return {
      products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find product by ID
   * @param id string
   * @returns Promise<Product>
   */
  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  /**
   * Update product by ID
   * @param id string
   * @param updateProductDto UpdateProductDto
   * @returns Promise<Product>
   */
  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.save({ ...updateProductDto, id });
  }

  /**
   * Remove product by ID
   * @param id string
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Product with ID ${id} not found`);
  }
}
