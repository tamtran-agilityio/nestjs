import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user?.id,
      username: user?.userName,
      roles: user?.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
