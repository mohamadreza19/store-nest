import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';

export enum UserState {
  ACTIVE = 'Active',
  IN_ACTIVE = 'Inactive',
}

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  readonly email: string;

  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
