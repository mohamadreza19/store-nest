import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}
export type UserRoles = 'user' | 'admin';
