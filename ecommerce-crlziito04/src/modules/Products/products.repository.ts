import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQuery } from 'src/dto/pagDto';
import { productsDto } from 'src/dto/productsDto';
import * as data from '../../data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { FileUploadRepositoy } from '../file-upload/file-upload.repository';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly fileUploadRepository: FileUploadRepositoy,
  ) {}
  async seederProducts() {
    const isCategory = await this.categoryRepository.find();

    if (isCategory.length === 0)
      throw new BadRequestException('There are not categories');

    const products = await this.productRepository.find();
    if (products.length === 0) {
      for (const product of data) {
        const findCategory = await this.categoryRepository.findOne({
          where: { name: product.category },
        });

        await this.productRepository.save({
          ...product,
          category: findCategory,
        });
      }
      return 'PreLoad Products';
    }
    return 'Charged Products';
  }

  async getAllProducts(pagination?: PaginationQuery) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    console.log(defaultLimit, defaultPage);

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const products = await this.productRepository.find({
      relations: { category: true },
    });
    const sliceProducts = products.slice(startIndex, endIndex);
    return sliceProducts;
  }

  async getProduct(id: string) {
    const foundProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { category: true },
    });
    if (!foundProduct) {
      throw new NotFoundException('Product not found');
    }
    return foundProduct;
  }
  async postProduct(product, file) {
    const productName = await this.productRepository.findOne({
      where: { name: product.name },
    });
    if (productName) {
      throw new BadRequestException('Product already exists');
    }

    const category = await this.categoryRepository.findOneBy({
      name: product.category,
    });
    if (!category)
      throw new NotFoundException('Category for this product not found');

    let imgUrl: string | undefined;
    if (file) {
      const uploadImgProduct = await this.fileUploadRepository.uploadImg(file);
      if (!uploadImgProduct) {
        throw new BadRequestException('Image upload failed');
      }
      imgUrl = uploadImgProduct.url;
    } else {
      imgUrl = product.imgUrl;
    }

    const newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: imgUrl,
      category: category,
    };
    return await this.productRepository.save(newProduct);
  }

  async putProduct(id, updateProduct) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    await this.productRepository.update(id, {
      ...updateProduct,
    });
    return findProduct.id;
  }
  async deleteProduct(id) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!findProduct) throw new NotFoundException('Product not found');
    await this.productRepository.delete(findProduct);
    return 'Product Deleted;';
  }
}
