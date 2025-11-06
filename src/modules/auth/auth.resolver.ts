import { Mutation, Resolver, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto';
import { Public } from 'src/common/decorators';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignupDto } from './dto/signup.dto';

@Resolver(() => 'Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponseDto, { name: 'Login' })
  async login(@Args('input') input: LoginDto): Promise<LoginResponseDto> {
    return this.authService.signIn(input.email, input.password);
  }

  @Public()
  @Mutation(() => SignupResponseDto, { name: 'Signup' })
  async signup(@Args('input') input: SignupDto): Promise<SignupResponseDto> {
    return this.authService.signup(input);
  }
}
