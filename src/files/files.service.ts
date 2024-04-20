import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileTypeE } from './file.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConditionType, FilesDocument } from './entities/file.entity';
import { ObjectId, UUID } from 'mongodb';
import { FileHelper } from 'src/utilities/file';
import { join } from 'path';
import { ProductsService } from 'src/products/products.service';
import { S3Client } from '@aws-sdk/client-s3';
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

  async update(id: string, file: Express.Multer.File) {
    const result = await this.fileModel.findById(id);
    if (!result) throw new NotFoundException();

    const format = FileHelper.convetMimetypeToFormat(file.mimetype);

    const newFileName = FileHelper.where('public').updateFile(
      result.name,
      format,
      file.buffer,
    );
    await this.fileModel.findByIdAndUpdate(id, {
      name: newFileName,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
