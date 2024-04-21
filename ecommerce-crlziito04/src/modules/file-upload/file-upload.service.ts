import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepositoy } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private fileUploadRepository: FileUploadRepositoy,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async uploadImg(productId: string, file: Express.Multer.File) {
    const findProduct = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!findProduct) throw new NotFoundException('PRODUCT NOT FOUND');

    const img = await this.fileUploadRepository.uploadImg(file);

    await this.productRepository.update(findProduct.id, {
      imgUrl: img.url,
    });

    const updateProduct = await this.productRepository.findOneBy({
      id: findProduct.id,
    });

    return updateProduct;
  }
}
