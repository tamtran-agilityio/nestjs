// src/modules/products/serialize/product.serialize.ts
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductSerialize {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  isActive: boolean;

  constructor(partial: Partial<ProductSerialize>) {
    Object.assign(this, partial);
  }
}
