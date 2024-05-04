import { Document } from 'mongoose';
import { UserRoles } from 'src/shared/interfaces';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}
