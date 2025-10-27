import { IsString, IsEmail, IsNumber, MinLength, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;
}
