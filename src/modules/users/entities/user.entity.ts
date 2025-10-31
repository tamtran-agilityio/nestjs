import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_doe',
  })
  @Column({ unique: true })
  userName: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({
    description: 'User age',
    example: 25,
  })
  @Column()
  age: number;

  @ApiProperty({
    description: 'Unique email address',
    example: 'john@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-10-31T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-10-31T10:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User roles',
    example: ['user', 'admin'],
    type: [String],
  })
  @Column({ type: 'varchar', array: true, nullable: true })
  roles: string[];

  @ApiHideProperty()
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
