import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, isNumber, isString, MinLength, minLength } from "class-validator";

export class CreateProductDto {



    @ApiProperty()
    @MinLength(5)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price:number
}
