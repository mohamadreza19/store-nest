import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
