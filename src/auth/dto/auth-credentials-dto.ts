import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsEmail,
} from 'class-validator';

export class SignInDto {
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
  // @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
}
export class SignUpDto {
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
  // @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
}
export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
