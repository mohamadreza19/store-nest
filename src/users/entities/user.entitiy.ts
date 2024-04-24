import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({
    default: Date.now,
  })
  createAt: string;
}
export type UsersDocument = Users & Document;
export const UsersEntitny = SchemaFactory.createForClass(Users);
