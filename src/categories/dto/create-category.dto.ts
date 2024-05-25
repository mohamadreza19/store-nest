import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'foo' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, examples: [null, 'foo'] })
  @IsString()
  @IsOptional()
  parent_id?: string;
}
