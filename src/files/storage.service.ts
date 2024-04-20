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
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import Storage from 'src/services/Storage';
import { Response } from 'express';

@Injectable()
export class StorageService {
  private s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      region: 'default',
      endpoint: process.env.STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.STORAGE_KEYID,
        secretAccessKey: process.env.STORAGE_ACCESSKEY,
      },
    });
  }

  add(buffer: Buffer, name: string) {
    // const uniuqeName = new UUID().toString() + suffix;

    return this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: name,
        Body: buffer,
        ACL: 'public-read',
      }),
    );
  }
  async get(name: string) {
    // const param = { Bucket: process.env.BUCKET, Key: name };
    // const param2 = { Bucket: process.env.BUCKET, Key: 'tt' };
    // const result = await this.s3.send(new GetObjectCommand(param));
    // console.log(result.Body);
    return process.env.STORAGE_ENDPOINT_TOFILE + '/' + name;
  }
  getFormatFromMimtype(fileMimetype: string) {
    return fileMimetype.split('/')[1];
  }
}
