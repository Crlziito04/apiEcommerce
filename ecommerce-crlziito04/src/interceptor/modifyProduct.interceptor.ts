import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class modifyProduct implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (request.body.imgUrl === '') {
      delete request.body.imgUrl;
    }
    request.body = {
      ...request.body,
      price: Number(request.body.price),
      stock: Number(request.body.stock),
    };

    return next.handle();
  }
}
