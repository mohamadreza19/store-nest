import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsDocument } from './entities/product.entity';

import { IDecodedUser, Sort, UserRoles } from 'src/shared/interfaces';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<ProductsDocument>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
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
    category: string,
    minPrice: number,
    maxPrice: number,
    role: UserRoles,
  ) {
    let query: any = {};
    const populate = role === 'admin' ? 'creator' : null;
    const selectCreator = role === 'admin' ? 'creator' : '-creator';
    const sortOrder = sort === 'asc' ? -1 : 1;

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice && !maxPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice && !minPrice) {
      query.price = { $lte: maxPrice };
    }
    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    const data = await this.productModel
      .find(query)
      .find()
      .sort({
        createAt: sortOrder,
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .select(selectCreator)
      .populate(populate)
      .populate('category')
      .exec();
    const total = await this.productModel.countDocuments(query);

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
    const product = await this.productModel.findById(id).populate('category');

    if (!product) throw new NotFoundException();

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

  async update(
    id: string,
    user: IDecodedUser,
    updateProductDto: UpdateProductDto,
  ) {
    console.log(updateProductDto);
    await this.productModel.updateOne({ _id: id }, updateProductDto);
    return;
  }

  async removeById(_id: string) {
    // const result = await this.productModel.findById({ _id });
    const result = await this.productModel.findOneAndDelete({ _id });

    if (!result) throw new NotFoundException();
    this.filesService.removeMany(result.files);
    // return result;
  }
}
