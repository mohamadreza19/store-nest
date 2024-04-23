import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsDocument } from './entities/product.entity';
import { FilesDocument } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';

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

  findAll() {
    return `This action returns all products`;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException();

    product;

    return product;
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
