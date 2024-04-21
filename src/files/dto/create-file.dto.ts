import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'src/shared/decorators/is-object-id.decorator';
import { FileTypeE } from '../file.interfaces';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const three_hundred_kilobytes = 300 * 1024;
    const error = 'file must be image/webp or video/mp4 ';

    if (!value || !value.mimetype) throw new BadRequestException(error);

    if (value.size > three_hundred_kilobytes)
      throw new BadRequestException('The file size is more than 300 KB');

    if (value.mimetype.includes(FileTypeE.WEBP)) return value;

    if (value.mimetype.includes(FileTypeE.MP4)) return value;

    throw new BadRequestException(error);
  }
}
enum EntityType {
  PRODUCT = 'product',
  USer = 'user',
}

export class CreateFileDto {
  @IsEnum(EntityType)
  entityType: string;

  @IsNotEmpty()
  @IsObjectId()
  entityId: string;
}
export class UpdateFileDto extends CreateFileDto {}
export class RemoveFileDto extends CreateFileDto {}
