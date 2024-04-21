import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { UsersRepository } from '../Users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userRepository: UsersRepository,
  ) {}
  async signUp(user: Partial<User>) {
    const findEmail = await this.userRepository.foundUserByEmail(user.email);
    if (findEmail) throw new ConflictException('Email already exists');

    const hashPassword = await bcrypt.hash(user.password, 10);
    if (!hashPassword)
      throw new BadRequestException('Password could not be hashed');

    const newUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      password: hashPassword,
      country: user.country,
      city: user.city,
      address: user.address,
    };
    return await this.userRepository.createUser(newUser);

    // const dbUser = await this.userRepository.findOneBy({
    //   email: newUser.email,
    // });

    // const { password, isAdmin, ...userWithOutPassword } = dbUser;

    // const userReturn = await Object.fromEntries(
    //   Object.entries(userWithOutPassword).filter(
    //     ([_, value]) => value !== null,
    //   ),
    // );

    // return userReturn;
  }

  async authSignin(email, password) {
    if (!email || !password)
      throw new BadRequestException('Please enter your email and Password');

    const emailUser = await this.userRepository.foundUserByEmail(email);

    if (!emailUser) {
      throw new UnauthorizedException('Email not Found or Password not Valid');
    }

    const checkPassword = await bcrypt.compare(password, emailUser.password);
    if (!checkPassword) {
      throw new UnauthorizedException('Email not Found or Password not Valid');
    }

    const payload = {
      id: emailUser.id,
      email: emailUser.email,
      role: [emailUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(payload);

    return { success: 'Login Success', token };
  }
}
