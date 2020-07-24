import { Controller, Get, Post, Param, Body, UseFilters, Scope, Delete, Put } from '@nestjs/common';
import { CreateCatDto } from '../dto/create-cat.dto';
import { CatsService } from '../services/cats.service';
import { HttpExceptionFilter } from '../../common/http-exception.filter';
import { Cat } from '../schemas/cat.schema'
import { UpdateCatDto } from '../dto/update-cat.dto';

@Controller({
  path: 'cats',
  scope: Scope.REQUEST
})
export class CatsController {
  constructor(private catService: CatsService) { }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catService.findAll()
  }

  @Get(':id')
  findOne(@Param() params: string[]): Promise<Cat> {
    return this.catService.finOne(params['id']);
  }

  @Post()
  @UseFilters(HttpExceptionFilter)
  async create(@Body() cat: CreateCatDto): Promise<Cat> {
    return this.catService.create(cat)
  }

  @Put(':id')
  @UseFilters(HttpExceptionFilter)
  async update(@Param() params: string[], @Body() cat: UpdateCatDto): Promise<Cat> {
    return this.catService.update(params['id'], cat)
  }

  @Delete(':id')
  async delete(@Param() params: string[]): Promise<void> {
    this.catService.delete(params['id'])
  }
}
