import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK) // Custom status code for login
    @Post('login')
    async login(@Body() loginDto: Record<string, any>) {
        return await this.authService.signIn(loginDto.email, loginDto.password);
    }
}
