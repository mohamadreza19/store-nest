import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateFileDto,
  RemoveFileDto,
  UpdateFileDto,
} from './dto/create-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConditionType, FilesDocument } from './entities/file.entity';
import { ObjectId, UUID } from 'mongodb';
import { FileHelper } from 'src/utilities/file';
import { join } from 'path';
import { ProductsService } from 'src/products/products.service';
import Storage from 'src/services/Storage';
import { StorageService } from './storage.service';
import { Response } from 'express';

const LIMIT_FILE = 10;
let LIMIT_FILE_ERROR = new BadRequestException('Entity has more than 10 files');

@Injectable()
export class FilesService {
  constructor(
    @InjectModel('files') private readonly fileModel: Model<FilesDocument>,
    private readonly productsService: ProductsService,
    private readonly storageService: StorageService,
  ) {}

  async create(createFileDto: CreateFileDto, file: Express.Multer.File) {
    let count: number;

    const uniuqeName =
      new UUID().toString() +
      '.' +
      this.storageService.getFormatFromMimtype(file.mimetype);

    if (createFileDto.entityType === 'product') {
      count = await this.productsService.ProductFileLenth(
        createFileDto.entityId,
      );

      if (count > LIMIT_FILE) throw LIMIT_FILE_ERROR;

      await this.storageService.add(file.buffer, uniuqeName);
      await this.productsService.pushFileId(createFileDto.entityId, uniuqeName);
    }
  }

  findAllByEntityId(_id: string) {
    return this.fileModel.find({
      entityId: _id,
    });
  }

  async findOne(name: string) {
    return this.storageService.get(name);
  }

  findByEntityIdAndCount(entityId: string) {
    return this.fileModel.find({ entityId }).countDocuments();
  }

  async update(
    id: string,
    updateFileDto: UpdateFileDto,
    file: Express.Multer.File,
  ) {
    const uniuqeName =
      new UUID().toString() +
      '.' +
      this.storageService.getFormatFromMimtype(file.mimetype);

    if (updateFileDto.entityType === 'product') {
      await this.storageService.delete(id);
      await this.productsService.pullFileId(updateFileDto.entityId, id);

      await this.storageService.add(file.buffer, uniuqeName);
      await this.productsService.pushFileId(updateFileDto.entityId, uniuqeName);
    }
    // await this.remove(id);
    // // await this.create()
  }

  async remove(removeFileDto: RemoveFileDto, fileId: string) {
    if (removeFileDto.entityType === 'product') {
      const result = await this.productsService.pullFileId(
        removeFileDto.entityId,
        fileId,
      );

      if (result.modifiedCount === 0)
        throw new NotFoundException('No file with this ID was found');

      await this.storageService.delete(fileId);
    }
  }
}
