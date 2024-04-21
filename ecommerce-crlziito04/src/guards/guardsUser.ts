import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import { usersDto } from 'src/dto/usersDto';

const validateRequest = async (request) => {
  if (request.method === 'POST') {
    const dtoInstance = plainToClass(usersDto, request.body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }
  if (request.method === 'PUT') {
    const dtoInstance = plainToClass(usersDto, request.body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }
};

@Injectable()
export class guardsUser implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
