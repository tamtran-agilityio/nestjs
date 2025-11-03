import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}