import { Controller, Get, Post, HttpCode, Param, Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { CatDto } from '../dto/cat.dto'
import { Cat } from '../interfaces/cat.interceptor'
import { CatsService } from '../services/cats.service';
import { ForbiddenException } from '../../common/forbidden.exception';
import { HttpExceptionFilter } from '../../common/http-exception.filter';

@Controller('cats')
export class CatsController {
  constructor(private catService: CatsService) { }

  @Get()
  async findAll(): Promise<Cat[]> {
    throw new ForbiddenException()
    return this.catService.findAll()
  }

  @Get(':id')
  findOne(@Param() params: string[]): string {
    console.log('params', params)
    return 'This action return cat detail'
  }

  @Post()
  @UseFilters(HttpExceptionFilter)
  async create(@Body() cat: CatDto): Promise<any> {
    this.catService.create(cat)
  }
}
