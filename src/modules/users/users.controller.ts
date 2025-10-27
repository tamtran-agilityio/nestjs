import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, Header, UseFilters, NotFoundException, HttpStatus, ParseBoolPipe, Query } from '@nestjs/common';
import type { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmExceptionFilter } from 'src/common/filters/typeorm-exception.filter';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { ParseBooleanPipe } from 'src/common/pipes/parse-boolean.pipe';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';

@Controller('users')
// Add TypeOrmExceptionFilter to handle database errors globally in this controller
@UseFilters(new TypeOrmExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Header('Cache-Control', 'no-store')
  // @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {

    // Encryption of password
    if (createUserDto.password) {
      const saltRounds = 10;
      createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);
    }
    return this.usersService.create(createUserDto);
  }


  @Get()
  async findAll(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBooleanPipe) activeOnly: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    const users = await this.usersService.findAll(activeOnly, page);
    return users;
  }

  @Get(':id')
  async findOne(@Param('id', UserByIdPipe) user) {
    return user;
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id) {
    return await this.usersService.remove(id);
  }
}
