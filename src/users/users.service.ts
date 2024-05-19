import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { UsersDocument } from './entities/user.entitiy';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/users.interface';
import { Sort } from 'src/shared/interfaces';
import { Users } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<UsersDocument>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: Sort = 'asc',
    search: string = '',
  ): Promise<{ data: Users[]; meta: any }> {
    const sortOrder = sort === 'asc' ? -1 : 1;
    const textSearch = search
      ? { username: { $regex: search, $options: 'i' } }
      : {};
    const data = await this.userModel
      .find(textSearch)
      .find()
      .sort({
        createAt: sortOrder,
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const total = await this.userModel.countDocuments(textSearch);

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
  async countAll() {
    return this.userModel.countDocuments();
  }
  async findOne(data: FilterQuery<IUser>): Promise<IUser | null> {
    return this.userModel.findOne(data);
  }
  async findById(id: string) {
    const result = await this.userModel.findById(id).exec();

    if (!result) throw new NotFoundException();

    return result;
  }
  async create(user: CreateUserDto) {
    return this.userModel.create(user);
  }
  async updateById(id: string, user: CreateUserDto) {
    return this.userModel.findByIdAndUpdate(id, user);
  }
}
