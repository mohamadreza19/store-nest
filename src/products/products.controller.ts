import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard, RoleGuard } from 'src/auth/auth.guard';
import { User } from 'src/shared/decorators';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDecodedUser, RequestWithUser } from 'src/shared/interfaces';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  async create(
    @User() user: IDecodedUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(user.id, createProductDto);
  }

  @UseGuards(RoleGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @Get()
  async findAll(@User() user: IDecodedUser) {
    return await this.productsService.findAll(user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.productsService.removeById(id);
  }
}
