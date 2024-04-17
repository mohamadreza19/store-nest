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
import { ObjectId } from 'mongodb';
import { FileHelper } from 'src/utilities/file';
import { join } from 'path';
import { ProductsService } from 'src/products/products.service';

const LIMIT_FILE = 10;
let LIMIT_FILE_ERROR = new BadRequestException('Entity has more than 10 files');

@Injectable()
export class FilesService {
  constructor(
    @InjectModel('files') private readonly fileModel: Model<FilesDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createFileDto: CreateFileDto, file: Express.Multer.File) {
    // const count = await this.findByEntityIdAndCount(createFileDto.entityId);

    let count: number;
    let savedName: string;
    const format = FileHelper.convetMimetypeToFormat(file.mimetype);

    if (createFileDto.entityType === 'product') {
      count = await this.productsService.ProductFileLenth(
        createFileDto.entityId,
      );
      if (count > LIMIT_FILE) throw LIMIT_FILE_ERROR;

      savedName = FileHelper.where('public').craeteFile(format, file.buffer);

      const result = await this.fileModel.create({
        entityType: createFileDto.entityType,
        name: savedName,
      });

      await this.productsService.pushFileId(createFileDto.entityId, result._id);
    }
  }

  findAllByEntityId(_id: string) {
    return this.fileModel.find({
      entityId: _id,
    });
  }

  async findOne(id: string) {
    const result = await this.fileModel.findById(id);
    if (!result) throw new NotFoundException();
    return result.name;
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
