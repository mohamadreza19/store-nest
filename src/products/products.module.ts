import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsEntitny } from './entities/product.entity';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { StorageService } from 'src/files/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: ProductsEntitny }]),
    forwardRef(() => FilesModule),
    // FilesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
