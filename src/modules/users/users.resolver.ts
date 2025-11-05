import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Product } from '../product/entities/product.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[] | null> {
    return this.usersService.findAll(true, 0); // Example usage
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: number): Promise<User | null> {
    console.log('Fetching user with ID:', id);
    return this.usersService.findOne(id);
  }

  // Mutations
  @Mutation(() => User, { name: 'createUser' })
  create(@Args('input') input: CreateUserDto): Promise<User> {
    return this.usersService.create(input);
  }

  @Mutation(() => User, { name: 'updateUser' })
  update(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  remove(@Args('id', { type: () => ID }) id: number): Promise<any> {
    return this.usersService.remove(id);
  }

  // Resolve relation optionally via DataLoader to avoid N+1
  @ResolveField(() => [Product], { name: 'products', nullable: true })
  products(@Parent() user: User): Product[] | Promise<Product[]> {
    // If you didn't eager load relations, fetch here (prefer DataLoader in real apps)
    return user.products ?? [];
  }
}
