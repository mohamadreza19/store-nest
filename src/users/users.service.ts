import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { UsersDocument } from './entities/user.entitiy';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<UsersDocument>,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }
  async findOne(data: FilterQuery<IUser>): Promise<IUser | null> {
    return this.userModel.findOne(data);
  }
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
  async create(user: CreateUserDto) {
    return this.userModel.create(user);
  }
  async updateById(id: string, user: CreateUserDto) {
    return this.userModel.findByIdAndUpdate(id, user);
  }
}
