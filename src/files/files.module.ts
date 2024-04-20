import { Module } from '@nestjs/common';
import { FilesService } from './files.service';

import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesEntitny } from './entities/file.entity';
import { ProductsModule } from 'src/products/products.module';
import { StorageService } from './storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'files', schema: FilesEntitny }]),
    ProductsModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, StorageService],
  exports: [FilesService],
})
export class FilesModule {}
