import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { FilesDocument, FilesEntitny } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';

@Schema()
export class Products {
  constructor(filesService: FilesService) {}

  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  creator: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'files' })
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

ProductsEntitny.pre('find', async function (next) {
  // const FilesModel = mongoose.model('Files') as Model<FilesDocument>;

  // const id = this._id as string;
  // const files = await FilesModel.find({ entityId: this._id });

  next();
});
// ProductsEntitny.pre('findOne', async function (next) {
//   const id = (this as any)._conditions._id;

//   const filesModel = mongoose.model(
//     'files',
//     FilesEntitny,
//   ) as mongoose.Model<FilesDocument>;
//   console.log(id);
//   const files = await filesModel.find();
//   console.log(files);
//   next();
// });

export { ProductsEntitny };
