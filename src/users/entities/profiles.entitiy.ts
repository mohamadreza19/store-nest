import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Profiles {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ default: null })
  fName: string;

  @Prop({ default: null })
  lName: string;

  @Prop({ default: null })
  irn_code: string;

  @Prop({
    default: null,
  })
  address: string;

  @Prop({
    default: Date.now,
  })
  createAt: string;

  @Prop({
    default: null,
  })
  birthday: Date;
}

export type ProfilesDocument = Profiles & Document;
const ProfilesEntitny = SchemaFactory.createForClass(Profiles);

ProfilesEntitny.index({ userId: 1 });

export default ProfilesEntitny;
