import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import {
  CreateFileDto,
  FileValidationPipe,
  RemoveFileDto,
  UpdateFileDto,
} from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { join } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const PUBLICPATH = join(__dirname, '..', '..', 'asset', 'public');
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileDto, description: 'file fields' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        entityType: {
          type: 'string',
          enum: ['product', 'user'],
        },
        entityId: {
          type: 'string',
        },
        // Include other fields if necessary
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    await this.filesService.create(createFileDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':fileId')
  @ApiBearerAuth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() updateFileDto: UpdateFileDto,
    @Param('fileId') fileId: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Res() res: Response,
  ) {
    await this.filesService.update(fileId, updateFileDto, file);
    res.end();
  }

  @Get(':fileId')
  async findOne(@Param('fileId') fileId: string, @Res() res: Response) {
    const url = await this.filesService.findOne(fileId);

    res.json({ url });
  }

  @Delete(':fileId')
  async deleteOne(
    @Body() removeFileDto: RemoveFileDto,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    await this.filesService.remove(removeFileDto, fileId);
    return res.end();
  }
}
