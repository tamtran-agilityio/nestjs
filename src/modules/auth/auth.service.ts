import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

    // Create the user
    const newUser = await this.usersService.create({
      email: signupDto.email,
      userName: signupDto.userName,
      password: hashedPassword,
      age: 18,
      isActive: true,
      roles: ['user'],
    });

    if (!newUser) {
      throw new UnauthorizedException('User creation failed');
    } else {
      return {
        message: 'Registration successful',
      };
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    // Handle roles properly - they might be stored as JSON string in SQLite
    let roles: string[] = ['user']; // default role
    if (user?.roles) {
      if (Array.isArray(user.roles)) {
        roles = user.roles;
      } else if (typeof user.roles === 'string') {
        try {
          roles = JSON.parse(user.roles);
        } catch {
          roles = [user.roles]; // treat as single role if not valid JSON
        }
      }
    }

    const payload = {
      id: user?.id,
      username: user?.userName,
      email: user?.email,
      roles: roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
