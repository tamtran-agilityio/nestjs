import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema<any>) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            console.log('ZodValidationPipe transforming value:', value);
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            console.error('ZodValidationPipe error:', error);
            throw new BadRequestException('Validation failed');
        }
    }
}