import { FindOptionsWhere } from 'typeorm';

export interface IRepository<T> {
  create(entity: Partial<T>): Promise<T | null>;
  save(entity: T): Promise<T>;
  findOneBy(where: FindOptionsWhere<T>): Promise<T | null>;
  find(options?: any): Promise<T[]>;
  update(criteria: any, partialEntity: Partial<T>): Promise<any>;
  delete(criteria: any): Promise<any>;
  findByEmail(email: FindOptionsWhere<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  findOneById(id: number): Promise<T | null>;
}
