import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { FilesDocument, FilesEntitny } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';

@Schema()
export class Products {
  constructor(filesService: FilesService) {}

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  creator: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ default: [], type: Types.ObjectId, ref: 'files' })
  files: Types.ObjectId[];

  @Prop()
  off_price: number;

  @Prop()
  off_precent: number;

  @Prop({
    default: Date.now,
  })
  createAt: string;

  @Prop({
    default: Date.now,
  })
  updatedAt: string;
}

export type ProductsDocument = Products & Document;
const ProductsEntitny = SchemaFactory.createForClass(Products);

export { ProductsEntitny };
