import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { users, usersDto } from '../../dto/usersDto';
import { LoginDto } from '../../dto/loginDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class authController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Registo Exitoso',
    schema: {
      example: {
        message: {
          id: 'e79f9f68-63ce-4c66-be46-13e2eef22e8b',
          name: 'Carlos',
          lastname: 'Perez',
          email: 'Pedro1@gmail.com',
          phone: '1125463604',
          country: 'Argentina',
          city: 'Mercedes',
          address: 'Libertador Avenue',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email Duplicado',
    schema: {
      example: {
        message: 'Email Duplicado',
      },
    },
  })
  @Post('signup')
  @ApiOperation({
    summary: 'Registrar Nuevo Usuario',
    description:
      'Endpoint para registrar nuevo usuario, verificando si existe email para el registro',
  })
  signUp(@Body() user: usersDto): Promise<users> {
    console.log(user);
    return this.authService.signUp(user);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login Realizado',
    schema: {
      example: {
        message: '{ success: "Login Success"; token }',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email, password no enviados',
    schema: {
      example: {
        message: 'Email, password no enviados',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email not Found or Password not Valid',
    schema: {
      example: {
        message: 'Email not Found or Password not Valid',
      },
    },
  })
  @Post('signin')
  @ApiOperation({
    summary: 'Login de usuario',
    description:
      'Endpoint para login de usuario, este devuelve token de autentificacion para usar en las rutas protegidas ',
  })
  authSignin(@Body() login: LoginDto): Promise<{ success: string; token }> {
    const { email, password } = login;
    return this.authService.authSignin(email, password);
  }
}
