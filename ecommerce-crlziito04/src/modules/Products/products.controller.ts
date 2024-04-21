import {
  Body,
  ConflictException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationQuery } from 'src/dto/pagDto';
import { GuardToken } from 'src/guards/guardToken';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/Auth/roles.enum';
import { guardRoles } from 'src/guards/guardRoles';
import { UpdateProduct, productsDto } from 'src/dto/productsDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeValidator } from 'src/pipes/minSizeValidator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from 'src/entities/product.entity';
import { modifyProduct } from 'src/interceptor/modifyProduct.interceptor';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}
  @HttpCode(200)
  @Get('seeder')
  @ApiResponse({ status: 200, description: 'ProductosCargados' })
  @ApiOperation({
    summary: 'Productos Precargados',
    description:
      'Endpoint para obtener precargados de app por medio de un archivoJson',
  })
  seederProducts(): Promise<string> {
    return this.productService.seederProducts();
  }

  @HttpCode(200)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Productos obtenidos correctamente',
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
  @ApiOperation({
    summary: 'Obtener todos los productos',
    description:
      'Endpoint para obtener todos los productos registrados. Muestra productos segun el paginado ingresado, 1page limit5 default',
  })
  getAllProducts(@Query() pagination?: PaginationQuery): Promise<Product[]> {
    console.log(pagination);
    return this.productService.getAllProducts(pagination);
  }

  @HttpCode(200)
  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description: 'Endpoint para obtener Producto por ID. ',
  })
  getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @HttpCode(201)
  @Post()
  @ApiResponse({ status: 201, description: 'Producto Creado' })
  @ApiResponse({
    status: 404,
    description: 'Producto Duplicado',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Producto Encontrado' })
  @ApiResponse({
    status: 404,
    description: 'producto no encontrado',
  })
  @ApiOperation({
    summary: 'Crear producto, RUTA PROTEGIDA',
    description:
      'Endpoint para CREAR producto, opcion de ingresar url de imagen o cargar archivo, de no hacerlo toma imagen por defecto. Si la categoria del producto no existe, CREAR CATEGORIA PRIMERO QUE EL PRODUCTO',
  })
  @Roles(Role.Admin)
  @UseGuards(GuardToken, guardRoles)
  @UseInterceptors(modifyProduct)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeValidator)
  async postProduct(
    @Body() product: productsDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Archivo debe ser menor a 200Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg)|(jpge)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File | null,
  ): Promise<Product> {
    console.log(product);
    return await this.productService.postProduct(product, file);
  }

  @HttpCode(200)
  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Producto editado' })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiOperation({
    summary: 'Actualizar producto por ID, RUTA PROTEGIDA',
    description:
      'Endpoint para actualizar Producto por ID. Devuelve Id del producto',
  })
  @Roles(Role.Admin)
  @UseGuards(GuardToken, guardRoles)
  putProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProduct: UpdateProduct,
  ): Promise<string> {
    return this.productService.putProduct(id, updateProduct);
  }

  @HttpCode(200)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Producto Borrado' })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiOperation({
    summary: 'Elimina producto por ID, RUTA PROTEGIDA',
    description: 'Endpoint para Elimina Producto por ID. ',
  })
  @Roles(Role.Admin)
  @UseGuards(GuardToken, guardRoles)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.productService.deleteProduct(id);
  }
}
