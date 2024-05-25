import { Request } from 'express';

export type Sort = 'asc' | 'desc';
export enum List {
  mobile = 'موبایل',
  electric_devices = 'کالای دیجیتال',
}
export enum SortEnum {
  asc = 'asc',
  desc = 'desc',
}
export type UserRoles = 'user' | 'admin';
export interface IDecodedUser {
  id?: string;
  role: UserRoles;
}

export interface RequestWithUser extends Request {
  user: IDecodedUser;
}
