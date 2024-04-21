import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUser, users, usersDto } from 'src/dto/usersDto';
import { guardsUser } from 'src/guards/guardsUser';
import { PaginationQuery } from 'src/dto/pagDto';
import { GuardToken } from 'src/guards/guardToken';
import { Role } from 'src/modules/Auth/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { guardRoles } from 'src/guards/guardRoles';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(200)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Usuarios obtenidos correctamente',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de página a recuperar',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Tamaño de página (número de resultados por página)',
    required: false,
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los usuarios, RUTA PROTEGIDA',
    description:
      'Endpoint para obtener todos los usuarios registrados. Muestra usuarios segun el paginado ingresado, 1page limit5 default',
  })
  @Roles(Role.Admin)
  @UseGuards(GuardToken, guardRoles)
  getAllUsers(@Query() pagination?: PaginationQuery): Promise<users[]> {
    return this.userService.getAllUsers(pagination);
  }

  @HttpCode(200)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'usuario Encontrado' })
  @ApiResponse({
    status: 404,
    description: 'usuario no encontrado',
    type: NotFoundException,
  })
  @ApiOperation({
    summary: 'Obtener unico usuario por ID',
    description: 'Endpoint para obtener unico usuario por ID',
  })
  @UseGuards(GuardToken)
  getUser(@Param('id', ParseUUIDPipe) id: string): Promise<users> {
    return this.userService.getUser(id);
  }

  @HttpCode(200)
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Producto Encontrado' })
  @ApiResponse({
    status: 404,
    description: 'usuario no encontrado',
    type: NotFoundException,
  })
  @ApiOperation({
    summary: 'Actualiza informacion de usuario',
    description: 'Endpoint para actualizar usuario, devuelve el ID de usuario',
  })
  @UseGuards(GuardToken)
  putUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUser,
  ): Promise<string> {
    return this.userService.putUser(id, updateUser);
  }

  @HttpCode(200)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Usuario borrado' })
  @ApiResponse({
    status: 404,
    description: 'usuario no encontrado',
  })
  @ApiOperation({
    summary: 'Elimina unico usuario por ID',
    description:
      'Endpoint para eliminar unico usuario por ID, devuelve ID del usuario',
  })
  @UseGuards(GuardToken)
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    console.log(id);
    return this.userService.deleteUser(id);
  }
}
