import { IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';
import { IsNotProvided, IsObjectId } from 'src/shared/decorators';

export class CreateProductDto {
  @MinLength(5)
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  off_price: number;

  @IsNumber()
  off_precent: number;
}
