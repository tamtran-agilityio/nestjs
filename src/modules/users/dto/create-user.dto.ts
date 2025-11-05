import {
  IsString,
  IsEmail,
  IsNumber,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @Field()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  age: number;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  roles: string[];
}
