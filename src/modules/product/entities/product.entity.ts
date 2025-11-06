// product.entity.ts
import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  Directive,
} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType('products')
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Unique(['name'])
  @Directive('@trim')
  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  // Configure relation for SQL lite foreign key
  @Field({ nullable: true })
  @Column({ nullable: true })
  userId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;
}
