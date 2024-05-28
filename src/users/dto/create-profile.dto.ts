import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsNumber,
  MaxLength,
  IsDate,
} from 'class-validator';

export enum UserState {
  ACTIVE = 'Active',
  IN_ACTIVE = 'Inactive',
}

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  readonly userId: string;

  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly fName: string;

  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly lName: string;

  @ApiProperty()
  @MinLength(10)
  @MaxLength(10)
  @IsNumber()
  readonly irn_code: number;

  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsDate()
  readonly birthday: string;
}
