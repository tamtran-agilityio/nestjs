import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductService } from './interfaces/product-service.interface';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

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
  findAll() {
    return this.productRepository.find();
  }

  /**
   * Find product by user ID owner
   * @param userId number
   * @returns 
   */
  findByUserId(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.productRepository.findOne({ where: { user: { id: userId } } });
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
