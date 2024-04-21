import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { productsDto } from 'src/dto/productsDto';
import { PaginationQuery } from 'src/dto/pagDto';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  seederProducts() {
    return this.productsRepository.seederProducts();
  }

  getAllProducts(pagination?: PaginationQuery) {
    return this.productsRepository.getAllProducts(pagination);
  }
  getProduct(id: string) {
    return this.productsRepository.getProduct(id);
  }
  postProduct(product, file) {
    return this.productsRepository.postProduct(product, file);
  }
  putProduct(id: string, updateProduct) {
    return this.productsRepository.putProduct(id, updateProduct);
  }
  deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }
}
