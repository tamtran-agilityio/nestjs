import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Header, UseFilters, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmExceptionFilter } from 'src/common/filters/typeorm-exception.filter';

@Controller('users')
@UseFilters(new TypeOrmExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Header('Cache-Control', 'no-store')
  async create(@Body() createUserDto: CreateUserDto) {
    // Encryption of password
    if (createUserDto.password) {
      const saltRounds = 10;
      createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      // Throw standard exception NotFoundException
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
