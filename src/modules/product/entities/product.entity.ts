// product.entity.ts
import { Optional } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Unique(['name'])
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Optional()
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Configure relation for SQL lite foreign key
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
}
