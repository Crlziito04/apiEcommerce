import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesServices } from './categories.service';
import { CategoryDto } from 'src/dto/categoryDto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { guardRoles } from 'src/guards/guardRoles';
import { GuardToken } from 'src/guards/guardToken';
import { Role } from '../Auth/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesServices) {}

  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Categorias Cargadas' })
  @Get('seeder')
  @ApiOperation({
    summary: 'Categorias precargadas',
    description: 'Endpoint para cargar categorias desde archivo JSON ',
  })
  seederCategories() {
    return this.categoriesService.seederCategories();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Categorias Obtenidas' })
  @ApiOperation({
    summary: 'Obtener todas las categorias',
    description: 'Endpoint para obtener todas las categorias creadas ',
  })
  getCategories(): Promise<CategoryDto[]> {
    return this.categoriesService.getCategories();
  }

  @HttpCode(201)
  @Post()
  @ApiResponse({ status: 201, description: 'Categoria Creada' })
  @ApiResponse({
    status: 409,
    description: 'Categoria Duplicada',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(GuardToken, guardRoles)
  @ApiOperation({
    summary: 'Crear nueva categoria',
    description:
      'Endpoint para crear nueva categoria, verificando si existe o no ',
  })
  addCategories(@Body() category: CategoryDto): Promise<CategoryDto> {
    const { name } = category;
    return this.categoriesService.addCategories(name);
  }
}
