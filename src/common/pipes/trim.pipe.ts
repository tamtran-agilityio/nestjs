import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'string' ? item.trim() : item,
      );
    }

    if (typeof value === 'object' && value !== null) {
      const trimmedObject: any = {};
      for (const key in value) {
        if (typeof value[key] === 'string') {
          trimmedObject[key] = value[key].trim();
        } else {
          trimmedObject[key] = value[key];
        }
      }
      return trimmedObject;
    }
    return value;
  }
}
