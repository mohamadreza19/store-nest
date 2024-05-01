import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false, default: null })
  parentId: string;
}

export type CategoriesDocument = Category & Document;
export const CategoriesEntitny = SchemaFactory.createForClass(Category);
