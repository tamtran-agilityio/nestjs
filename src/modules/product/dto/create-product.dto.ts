// create-product.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: number;
}
