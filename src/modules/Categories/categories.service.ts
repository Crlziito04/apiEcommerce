import * as data from '../../data.json';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesServices {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async seederCategories() {
    //Precargar Categorias de JSON
    const categoriesFromJson = new Set<string>();
    data.forEach((producto) => categoriesFromJson.add(producto.category));
    const categories = Array.from(categoriesFromJson);

    //!Cargarlas en tabla
    for (const categoryName of categories) {
      const existCategory = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      //*Si no existe, guarda en la tabla
      if (!existCategory) {
        await this.categoryRepository.save({ name: categoryName });
      }
    }
    return 'PreLoad-Categories';
  }

  async getCategories() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async addCategories(categoryName) {
    const findCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!findCategory) {
      const newCategory = await this.categoryRepository.save({
        name: categoryName,
      });
      return newCategory;
    } else {
      throw new ConflictException('Categories already exist');
    }
  }
}
