import {
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { minSizeValidator } from 'src/pipes/minSizeValidator';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from 'src/entities/product.entity';
import { format } from 'path';

@ApiTags('files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @HttpCode(200)
  @Post('uploadImage/:id')
  @ApiResponse({ status: 200, description: 'Imagen Subida a Nube' })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({
    summary: 'Uploaded IMAGE',
    description:
      'Endpoint para cargar archivo de imagen, formatos permitidos (jpg)|(jpge)|(png)|(webp) ',
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(minSizeValidator)
  async uploadImage(
    @Param('id', ParseUUIDPipe) productId: string,
    @UploadedFile(
      //*Validar archivo de img
      new ParseFilePipe({
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
    file: Express.Multer.File,
  ): Promise<Product> {
    return await this.fileUploadService.uploadImg(productId, file);
  }
}
