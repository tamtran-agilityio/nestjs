import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

@InputType()
export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  userName: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
