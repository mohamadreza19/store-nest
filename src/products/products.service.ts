import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsDocument } from './entities/product.entity';

import { Sort, UserRoles } from 'src/shared/interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<ProductsDocument>,
    // private readonly filesService: FilesService,
  ) {}
  create(creator: string, createProductDto: CreateProductDto) {
    return this.productModel.create({
      ...createProductDto,
      creator,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: Sort = 'asc',
    search: string = '',
    role: UserRoles,
  ) {
    const populate = role == 'admin' ? 'creator' : null;
    const sortOrder = sort === 'asc' ? -1 : 1;
    const textSearch = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const data = await this.productModel
      .find(textSearch)
      .find()
      .sort({
        createAt: sortOrder,
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(populate)
      .exec();
    const total = await this.productModel.countDocuments(textSearch);

    const pages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        pages,
        page: Number(page),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException();

    product;

    return product;
  }
  async countAll() {
    return this.productModel.countDocuments();
  }
  async ProductFileLenth(_id: string) {
    const result = await this.productModel.findById(_id);
    if (!result) throw new NotFoundException();

    return result.files.length;
  }
  async pushFileId(_id: string, uniuqeName: string) {
    return await this.productModel.updateOne(
      {
        _id,
      },
      {
        $push: {
          files: uniuqeName,
        },
      },
    );
  }
  async pullFileId(entityId: string, elementId: string) {
    return await this.productModel.updateOne(
      {
        _id: entityId,
      },
      {
        $pull: {
          files: elementId,
        },
      },
    );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async removeById(_id: string) {
    const result = await this.productModel.deleteOne({ _id });

    if (!result.deletedCount) throw new NotFoundException();
    return result;
  }
}
