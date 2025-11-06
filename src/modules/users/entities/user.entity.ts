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
import {
  ObjectType,
  Field,
  ID,
  HideField,
  GraphQLISODateTime,
  Directive,
} from '@nestjs/graphql';

import { Product } from '../../product/entities/product.entity';
import { Role } from '../../../common/enums/role.enum';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_doe',
  })
  @Field()
  @Directive('@trim')
  @Column({ unique: true })
  userName: string;

  @ApiHideProperty()
  @Exclude()
  @HideField()
  @Column()
  password: string;

  @ApiProperty({
    description: 'User age',
    example: 25,
  })
  @Field()
  @Column()
  age: number;

  @ApiProperty({
    description: 'Unique email address',
    example: 'john@example.com',
  })
  @Field()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-10-31T10:00:00.000Z',
  })
  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-10-31T10:00:00.000Z',
  })
  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Field()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User roles',
    example: [Role.USER, Role.ADMIN],
    enum: Role,
    isArray: true,
  })
  @Field(() => [Role])
  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'varchar',
    array: process.env.NODE_ENV !== 'test',
    nullable: true,
    transformer: {
      to: (value: Role[]) =>
        process.env.NODE_ENV === 'test' ? JSON.stringify(value) : value,
      from: (value: string | Role[]) => {
        if (process.env.NODE_ENV === 'test' && typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            return [Role.USER];
          }
        }
        return Array.isArray(value) ? value : [Role.USER];
      },
    },
  })
  roles: Role[];

  @ApiHideProperty()
  @HideField()
  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
