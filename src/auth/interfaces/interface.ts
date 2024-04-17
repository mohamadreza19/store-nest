import { Request } from 'express';

export interface IDecodedUser {
  id?: string;
}

export interface RequestWithUser extends Request {
  user: IDecodedUser;
}
