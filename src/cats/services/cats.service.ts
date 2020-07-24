
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Cat } from '../schemas/cat.schema';
import { CreateCatDto } from '../dto/create-cat.dto';
import { UpdateCatDto } from '../dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    @InjectConnection() private connection: Connection
  ) { }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    const filter = { _id: id };

    return this.catModel.findOneAndUpdate(
      filter,
      updateCatDto,
      { new: true }
    ).exec();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async finOne(id: string): Promise<Cat> {
    return this.catModel.findById(id);
  }

  async delete(id: string): Promise<any> {
    return this.catModel.remove({ _id: id })
  }
}
