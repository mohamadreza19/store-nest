import { Request } from 'express';
import { UserRoles } from 'src/users/interfaces/users.interface';

export interface IDecodedUser {
  id?: string;
  role: UserRoles;
}

export interface RequestWithUser extends Request {
  user: IDecodedUser;
}
