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

  /**
   * Create a new user
   * @param createUserDto CreateUserDto
   * @returns Promise<User>
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    // Throw error if duplicate found
    this.exceptionService.ensureNoDuplicate(
      !!existingUser,
      'email',
      createUserDto.email,
    );

    return this.usersRepository.save(createUserDto);
  }

  /**
   * Find all users with optional active filter and pagination
   * Find all users with optional active filter and pagination
   * @param activeOnly boolean
   * @param page number
   * @returns Promise<User[] | null>
   */
  async findAll(activeOnly: boolean, page: number): Promise<User[] | null> {
    const whereClause: FindOptionsWhere<User> = { isActive: activeOnly };

    const users = await this.usersRepository.find({
      where: whereClause,
      skip: page * 10,
      take: 10,
    });
    return users;
  }

  /**
   * Find one user by ID
   * @param id number
   * @returns Promise<User>
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.exceptionService.ensureEntityExists(user, 'User', id);
  }

  /**
   * Update user by ID
   * @param id number
   * @param updateUserDto UpdateUserDto
   * @returns Promise<User>
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // This will throw if not found

    // If updating email, check for duplicates
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });
      this.exceptionService.ensureNoDuplicate(
        !!existingUser,
        'email',
        updateUserDto.email,
      );
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  /**
   * Remove user by ID
   * @param id number
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // This will throw if not found
    await this.usersRepository.delete(id);
  }

  /**
   * Find user by email
   * @param email string
   * @returns Promise<User | null>
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  /**
   * Find user by ID
   * @param id number
   * @returns Promise<User | null>
   */
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}
