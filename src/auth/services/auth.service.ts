import { Injectable } from '@nestjs/common';
import { UsersService, User } from '../../users/services';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(userName)
    console.log('user ***', user)

    if (user && user.password === pass) {
      return user
    }

    return null
  }

  async login(user: User): Promise<any> {
    const payload = { userName: user.userName, id: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
