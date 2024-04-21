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
} from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from 'src/auth/interfaces/interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const PUBLICPATH = join(__dirname, '..', '..', 'asset', 'public');
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    await this.filesService.create(createFileDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':fileId')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('fileId') fileId: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.filesService.update(fileId, file);
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
