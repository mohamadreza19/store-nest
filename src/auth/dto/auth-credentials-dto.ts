import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsEmail,
  isString,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
  // @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
}
export class SignInDto {
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
  // @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
}
export class SendEmailDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
export class VerifyCodeDto {
  @ApiProperty()
  @IsString()
  readonly code: string;
  // @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
}
export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
