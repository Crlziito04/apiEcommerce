import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { authController } from './auth.controller';
import { User } from 'src/entities/user.entity';
import { usersDto } from 'src/dto/usersDto';

describe('AuthController', () => {
  const mockUser: usersDto = {
    name: 'Juan2',
    lastname: 'Gonzalez3',
    email: 'juan.gonzalez3@example.com',
    phone: '9876543210',
    country: 'México',
    city: 'Ciudad de México',
    address: 'Reforma Avenue',
    password: 'password',
    confirmPassword: 'password',
  };

  const mockAuthService: Partial<AuthService> = {
    signUp: () =>
      Promise.resolve({
        id: '70200e92-cdd0-4e11-9a5f-2679e707d3c3',
        name: 'Juan2',
        lastname: 'Gonzalez3',
        email: 'juan.gonzalez3@example.com',
        phone: '9876543210',
        country: 'México',
        city: 'Ciudad de México',
        address: 'Reforma Avenue',
        orders: [],
      }),
    authSignin: () =>
      Promise.resolve({ success: 'Login Success', token: 'hola' }),
  };

  let mockAuthController: Partial<authController>;

  it('Crear Instancia AuthService', async () => {
    const module = await Test.createTestingModule({
      providers: [
        authController,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();
    mockAuthController = module.get<authController>(authController);
    expect(mockAuthController).toBeDefined();
  });
  it('Return User', async () => {
    mockAuthService.signUp = () =>
      Promise.resolve({
        id: '70200e92-cdd0-4e11-9a5f-2679e707d3c3',
        name: 'Juan2',
        lastname: 'Gonzalez3',
        email: 'juan.gonzalez3@example.com',
        phone: '9876543210',
        country: 'México',
        city: 'Ciudad de México',
        address: 'Reforma Avenue',
        orders: [],
      });

    await mockAuthController.signUp(mockUser);

    expect(mockUser).not.toEqual({
      id: '70200e92-cdd0-4e11-9a5f-2679e707d3c3',
      name: 'Juan2',
      lastname: 'Gonzalez3',
      email: 'juan.gonzalez3@example.com',
      phone: '9876543210',
      country: 'México',
      city: 'Ciudad de México',
      address: 'Reforma Avenue',
      orders: [],
    });
  });
});
