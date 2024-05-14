import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriesDocument } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('categories')
    private readonly categoryModel: Model<CategoriesDocument>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll(page: number = 1, limit: number = 10, parent_id: string) {
    const parent_idControled = parent_id
      ? { parent_id: parent_id }
      : { parent_id: null };
    const data = await this.categoryModel

      .find(parent_idControled)
      .limit(limit)
      // .skip((page - 1) * limit)
      .exec();
    // const total = await this.categoryModel.countDocuments(parent_idControled);

    // const pages = Math.ceil(total / limit);

    return data;
  }

  async findOne(id: string) {
    const result = await this.categoryModel.findById(id);

    if (!result) throw new NotFoundException();

    return result;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
