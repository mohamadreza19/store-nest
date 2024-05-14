import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';
import { IsNotProvided, IsObjectId } from 'src/shared/decorators';

export class CreateProductDto {
  @ApiProperty()
  @MinLength(5)
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  off_price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  off_precent: number;

  @ApiProperty()
  category: string;
}
