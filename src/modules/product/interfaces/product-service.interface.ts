// interfaces/product-service.interface.ts
import { IProduct } from './product.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductService {
  findAll(): Promise<IProduct[]>;
  findOne(id: string): Promise<IProduct | null>;
  create(data: CreateProductDto): Promise<IProduct>;
  update(id: string, data: UpdateProductDto): Promise<IProduct>;
  remove(id: string): Promise<void>;
}
