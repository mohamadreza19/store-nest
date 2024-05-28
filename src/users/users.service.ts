import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { UsersDocument } from './entities/user.entitiy';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/users.interface';
import { Sort } from 'src/shared/interfaces';
import { Users } from './users.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesDocument } from './entities/profiles.entitiy';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<UsersDocument>,
    @InjectModel('profiles')
    private readonly profileModel: Model<ProfilesDocument>,
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
    const result = await this.userModel.findById(id);

    if (!result) throw new NotFoundException();

    return result;
  }
  async create(user: CreateUserDto) {
    const result = await this.userModel.create(user);
    await this.createProfile(result._id);
    return result;
  }
  private async createProfile(userId: ObjectId) {
    await this.profileModel.create({
      userId,
    });
  }
  async getProfileByUserId(userId: string) {
    return this.profileModel.findOne({
      userId,
    });
  }
  async updateById(id: string, user: CreateUserDto) {
    return this.userModel.findByIdAndUpdate(id, user);
  }
}
