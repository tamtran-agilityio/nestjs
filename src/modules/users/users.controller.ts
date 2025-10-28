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
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSerialize } from './serialize/user.serialize';
import { SerializeWith } from 'src/common/interceptors/roles-serialize.interceptor';
import { TypeOrmExceptionFilter } from 'src/common/filters/typeorm-exception.filter';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { ParseBooleanPipe } from 'src/common/pipes/parse-boolean.pipe';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { Roles } from 'src/common/guards/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
// Add TypeOrmExceptionFilter to handle database errors globally in this controller
@UseFilters(new TypeOrmExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @Header('Cache-Control', 'no-store')
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Get()
  @Roles(['admin', 'user'])
  @UseInterceptors(SerializeWith(UserSerialize))
  @SerializeOptions({ type: UserSerialize })
  async findAll(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBooleanPipe)
    activeOnly: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    const users = await this.usersService.findAll(activeOnly, page);
    return users;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserSerialize })
  async findOne(@Param('id', UserByIdPipe) user) {
    return user;
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserSerialize })
  async update(
    @Param('id', new ParseIntPipe()) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(SerializeWith(UserSerialize))
  async remove(@Param('id', new ParseIntPipe()) id) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
