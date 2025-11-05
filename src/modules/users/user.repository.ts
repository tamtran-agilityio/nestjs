import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IRepository } from './repository.interface';

export class UserRepository implements IRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async create(entity: Partial<User>): Promise<User> {
    return this.repository.create(entity);
  }

  async save(entity: User): Promise<User> {
    return this.repository.save(entity);
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    const user = await this.repository.findOne({
      where: where.email ? { email: ILike(where.email) } : where,
    });
    return user;
  }

  async find(options?: any): Promise<User[]> {
    return this.repository.find(options);
  }

  async update(criteria: any, partialEntity: Partial<User>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }

  async delete(criteria: any): Promise<any> {
    return this.repository.delete(criteria);
  }
}
