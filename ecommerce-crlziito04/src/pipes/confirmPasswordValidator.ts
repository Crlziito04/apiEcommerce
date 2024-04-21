import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ConfirmPasswordService implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value.password ||
      !value.confirmPassword ||
      value.password !== value.confirmPassword
    )
      throw new BadRequestException(
        'Please Enter password, the value has to be the same as confirmPassword',
      );
    return value;
  }
}
