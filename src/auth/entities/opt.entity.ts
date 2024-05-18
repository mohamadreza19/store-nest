import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Otp {
  constructor() {}
  @Prop({
    type: Date,
    expires: '3m',
    default: Date.now,
  })
  expireAt: string;

  @Prop()
  code: string;

  @Prop()
  email: string;
}

export type OtpDocument = Otp & Document;

export const OtpSchema = SchemaFactory.createForClass(Otp);
