import {
  IsString,
  IsEmail,
  IsNumber,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString({ each: true })
  roles: string[];
}
