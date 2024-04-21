import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../Users/users.repository';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  const mockHashedPassword = 'hashedPassword';
  const mockUser: User = {
    id: '70200e92-cdd0-4e11-9a5f-2679e707d3c3',
    name: 'Juan2',
    lastname: 'Gonzalez3',
    email: 'juan.gonzalez3@example.com',
    phone: '9876543210',
    country: 'México',
    city: 'Ciudad de México',
    address: 'Reforma Avenue',
    password: 'password',
    isAdmin: false,
    orders: [],
  };

  let mockJwtService: Partial<JwtService>;
  let mockUserRepository: Partial<UsersRepository>;

  let mockAuthService: Partial<AuthService> = {
    signUp: () => Promise.resolve(mockUser),
    authSignin: () =>
      Promise.resolve({ success: 'Login Success', token: 'hola' }),
  };

  beforeAll(async () => {
    mockJwtService = {
      sign: () => 'hola',
    };
    mockUserRepository = {
      foundUserByEmail: (email: string) => Promise.resolve(null),
      createUser: () => Promise.resolve(mockUser),
    };
  });

  it('Crear Instancia AuthService', async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersRepository, useValue: mockUserRepository },
      ],
    }).compile();
    mockAuthService = module.get<AuthService>(AuthService);
    expect(mockAuthService).toBeDefined();
  });

  it('Register Success', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation((data, salt) => Promise.resolve(mockHashedPassword));

    const result = await mockAuthService.signUp({
      email: 'juan.gonzalez@example.com',
    });
    expect(result).toEqual(mockUser);
  });

  it('Email already exists', async () => {
    mockUserRepository.foundUserByEmail = () => Promise.resolve(mockUser);
    try {
      await mockAuthService.signUp(mockUser);
    } catch (error) {
      expect(error.message).toEqual('Email already exists');
    }
  });

  it('signin, failed', async () => {
    mockUserRepository.foundUserByEmail = () => Promise.resolve(undefined);

    try {
      await mockAuthService.authSignin(mockUser.password, mockUser.email);
    } catch (error) {
      expect(error.message).toEqual('Email not Found or Password not Valid');
    }
  });

  it('signin', async () => {
    mockUserRepository.foundUserByEmail = () => Promise.resolve(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const result = await mockAuthService.authSignin(
      'juan.gonzalez3@example.com',
      'password',
    );
    expect(result.token).toEqual('hola');
  });
});
