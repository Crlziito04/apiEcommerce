import { BadRequestException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ConfirmPass', async: false })
export class ConfirmPass implements ValidatorConstraintInterface {
  validate(password: string, arg: ValidationArguments) {
    if (password !== (arg.object as any)[arg.constraints[0]]) return false;
    return true;
  }
  defaultMessage(arg: ValidationArguments): string {
    throw new BadRequestException('Password does not Match');
  }
}
