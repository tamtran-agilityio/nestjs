import { IsString, IsEmail, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;
}
