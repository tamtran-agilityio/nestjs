import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
    @ApiProperty({
        description: 'Message indicating successful signup',
        example: 'User registered successfully',
        type: String,
    })
    message: string;
}
