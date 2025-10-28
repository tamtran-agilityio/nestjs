import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    console.log('ParseBooleanPipe transforming value:', value);
    if (value === undefined || value === null) {
      return false;
    }

    const stringValue = value.toString().toLowerCase().trim();

    // Handle various true representations
    if (['true', '1', 'yes', 'on'].includes(stringValue)) {
      return true;
    }

    // Handle various false representations
    if (['false', '0', 'no', 'off', ''].includes(stringValue)) {
      return false;
    }

    // If none of the above, throw an error
    throw new BadRequestException(
      `Invalid boolean value: "${value}". Expected: true, false, 1, 0, yes, no, on, off`,
    );
  }
}
