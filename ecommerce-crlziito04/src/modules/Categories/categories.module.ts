import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesServices } from './categories.service';
import { Category } from 'src/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesServices],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
