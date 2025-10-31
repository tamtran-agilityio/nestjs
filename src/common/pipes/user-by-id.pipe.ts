import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const val = parseInt(value, 10);
    // Implement your logic to find a user by ID
    const user = await this.userService.findOneById(val);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
