import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Header,
  UseFilters,
  Query,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSerialize } from './serialize/user.serialize';
import { SerializeWith } from '../../common/interceptors/serialize.interceptor';
import { TypeOrmExceptionFilter } from '../../common/filters/typeorm-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { ParseBooleanPipe } from '../../common/pipes/parse-boolean.pipe';
import { UserByIdPipe } from '../../common/pipes/user-by-id.pipe';
import { Public } from '../../common/decorators/public.decorator';
import { Auth } from '../../common/decorators/auth.decorator';

@ApiTags('Users')
@Controller('users')
// Add TypeOrmExceptionFilter to handle database errors globally in this controller
@UseFilters(new TypeOrmExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * @param createUserDto CreateUserDto
   * @returns Promise<User>
   */
  @Public()
  @Post()
  @Header('Cache-Control', 'no-store')
  @SerializeOptions({ type: UserSerialize })
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    // Encryption of password
    if (createUserDto.password) {
      const saltRounds = 10;
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Find all users with optional active filter and pagination
   * @param activeOnly boolean
   * @param page number
   * @returns Promise<User[] | null>
   */
  @ApiBearerAuth('JWT-auth')
  @Get()
  @Auth('admin', 'user')
  @UseInterceptors(SerializeWith(UserSerialize))
  @SerializeOptions({ type: UserSerialize })
  async findAll(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBooleanPipe)
    activeOnly: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    console.log('Fetching all users with filters:', { activeOnly, page });
    const users = await this.usersService.findAll(activeOnly, page);
    return users;
  }

  /**
   * Find one user by ID
   * @param id number
   * @returns Promise<User>
   */
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @SerializeOptions({ type: UserSerialize })
  findOne(@Param('id', UserByIdPipe) user) {
    return user;
  }

  /**
   * Update user by ID
   * @param id number
   * @param updateUserDto UpdateUserDto
   * @returns Promise<User>
   */
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @SerializeOptions({ type: UserSerialize })
  async update(
    @Param('id', new ParseIntPipe()) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  /**
   * Remove user by ID
   * @param id number
   * @returns Promise<void>
   */
  @ApiBearerAuth('JWT-auth')
  @Auth('admin')
  @Delete(':id')
  @UseInterceptors(SerializeWith(UserSerialize))
  async remove(@Param('id', new ParseIntPipe()) id) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
