import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class minSizeValidator implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) return value;

    const minSize = 5000;

    if (value.size < minSize) {
      throw new BadRequestException('Size must be greater than 20000');
    }
    return value;
  }
}
