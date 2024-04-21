import { BadRequestException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'checkDecimal', async: false })
export class checkDecimal implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments) {
    console.log(typeof value);
    const decimal = value.toString().split('.');
    if (decimal[1].length <= 2) return true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new BadRequestException('Number invalid, decimal must be 2 digits');
  }
}
