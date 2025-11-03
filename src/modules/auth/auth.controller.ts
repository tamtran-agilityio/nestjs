import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
    return await this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'Valid login example',
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      timestamp: '2024-10-31T10:00:00.000Z',
      path: '/auth/login',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.signIn(loginDto.email, loginDto.password);
  }

  @ApiOperation({
    summary: 'Get user profile',
    description:
      "Retrieve the authenticated user's profile information. Requires a valid JWT token in the Authorization header.",
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: User,
    example: {
      id: 1,
      userName: 'john_doe',
      email: 'john@example.com',
      age: 25,
      isActive: true,
      roles: ['user'],
      createdAt: '2024-10-31T10:00:00.000Z',
      updatedAt: '2024-10-31T10:00:00.000Z',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      timestamp: '2024-10-31T10:00:00.000Z',
      path: '/auth/profile',
    },
  })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@UserDecorator() user: User): User {
    return user;
  }
}
