import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  createAt: string;
}
export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);
