import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ExceptionService } from '../../common/exceptions/exception.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly exceptionService: ExceptionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOneBy({ 
      email: createUserDto.email 
    });
    
    this.exceptionService.ensureNoDuplicate(
      !!existingUser, 
      'email', 
      createUserDto.email
    );

    return this.usersRepository.save(createUserDto);
  }

  findAll(activeOnly: boolean, page: number): Promise<User[] | null> {
    console.log('activeOnly:', activeOnly, 'page:', page);
    const whereClause: FindOptionsWhere<User> = { isActive: activeOnly };
    
    return this.usersRepository.find({
      where: whereClause,
      skip: page * 10,
      take: 10,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.exceptionService.ensureEntityExists(user, 'User', id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // This will throw if not found
    
    // If updating email, check for duplicates
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOneBy({ 
        email: updateUserDto.email 
      });
      this.exceptionService.ensureNoDuplicate(
        !!existingUser, 
        'email', 
        updateUserDto.email
      );
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // This will throw if not found
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}
