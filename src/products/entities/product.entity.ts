import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

@Schema()
export class Products {
  constructor() {}

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, ref: 'users' })
  creator: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'categories' })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ defaul: 0 })
  off_price: number;

  @Prop({ defaul: 0 })
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
