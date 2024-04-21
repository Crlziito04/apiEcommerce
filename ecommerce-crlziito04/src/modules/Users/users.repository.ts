import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQuery } from '../../dto/pagDto';
import { usersDto } from '../../dto/usersDto';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getAllUsers(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find({
      relations: { orders: true },
    });

    const usersNotPassword = users
      .map((user) => {
        const { password, isAdmin, ...userNotPassWord } = user;
        return userNotPassWord;
      })
      .slice(startIndex, endIndex);

    return usersNotPassword;
  }

  async getUser(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: { orders: true },
    });
    if (!foundUser) {
      throw new NotFoundException('User notFound');
    }
    const { password, isAdmin, ...userNotPassword } = await foundUser;
    return userNotPassword;
  }

  // async postUser(user: usersDto) {
  //   const userEmail = await this.userRepository.findOne({
  //     where: { email: user.email },
  //   });
  //   if (userEmail) {
  //     throw new ConflictException('Email Duplicated');
  //   }
  //   const newUser = {
  //     name: user.name,
  //     lastname: user.lastname,
  //     email: user.email,
  //     password: user.password,
  //     phone: user.phone,
  //     country: user.country,
  //     city: user.city,
  //     address: user.address,
  //   };
  //   await this.userRepository.save(newUser);

  //   const dbUser = await this.userRepository.findOneBy({
  //     email: newUser.email,
  //   });

  //   const { password, isAdmin, ...userWithOutPassword } = dbUser;
  //   return userWithOutPassword;
  // }

  async putUser(id, updateUser) {
    const findUser = await this.userRepository.findOne({ where: { id: id } });
    if (!findUser) if (!findUser) throw new NotFoundException('User notFound');

    await this.userRepository.update(id, { ...updateUser });
    return findUser.id;
  }

  async deleteUser(id) {
    const findUser = await this.userRepository.findOne({ where: { id: id } });
    if (!findUser) throw new NotFoundException('User notFound');
    await this.userRepository.delete(findUser);
    return findUser.id;
  }

  async foundUserByEmail(email: string) {
    const userEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    return userEmail;
  }

  async createUser(user: Partial<usersDto>) {
    const userEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userEmail) {
      throw new ConflictException('Email Duplicated');
    }
    const newUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      phone: user.phone,
      country: user.country,
      city: user.city,
      address: user.address,
    };
    await this.userRepository.save(newUser);

    const dbUser = await this.userRepository.findOneBy({
      email: newUser.email,
    });

    const { password, isAdmin, ...userWithOutPassword } = dbUser;
    return userWithOutPassword;
  }
}
