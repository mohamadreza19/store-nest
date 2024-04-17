import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Files {
  @Prop({ required: true, enum: ['product', 'user'] })
  entityType: string;

  @Prop()
  name: string;

  @Prop({
    default: Date.now,
  })
  createAt: string;

  @Prop({
    default: Date.now,
  })
  updateAt: string;
}
export type FilesDocument = Files & Document;
export const FilesEntitny = SchemaFactory.createForClass(Files);

export type ConditionType = 'img' | 'video';
