import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Header } from '@nestjs/common';
import type { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
