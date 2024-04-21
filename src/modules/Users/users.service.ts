import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { usersDto } from 'src/dto/usersDto';
import { PaginationQuery } from 'src/dto/pagDto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getAllUsers(pagination?: PaginationQuery) {
    return this.usersRepository.getAllUsers(pagination);
  }
  getUser(id: string) {
    return this.usersRepository.getUser(id);
  }

  putUser(id: string, updateProduct) {
    return this.usersRepository.putUser(id, updateProduct);
  }
  deleteUser(id: string) {
    return this.usersRepository.deleteUser(id);
  }
}
