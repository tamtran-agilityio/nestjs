import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignupResponseDto {
  @ApiProperty({
    description: 'Message indicating successful signup',
    example: 'User registered successfully',
    type: String,
  })
  @Field()
  message: string;
}
