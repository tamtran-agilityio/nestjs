import { PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
