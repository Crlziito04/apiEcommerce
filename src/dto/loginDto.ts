import { PickType } from '@nestjs/swagger';
import { usersDto } from './usersDto';

export class LoginDto extends PickType(usersDto, ['email', 'password']) {}
