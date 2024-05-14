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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { User } from 'src/shared/decorators';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IDecodedUser,
  RequestWithUser,
  Sort,
  SortEnum,
} from 'src/shared/interfaces';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth('admin')
  async create(
    @User() user: IDecodedUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(user.id, createProductDto);
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @Get()
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sort', required: false, enum: SortEnum, enumName: 'Sort' })
  @ApiQuery({ name: 'search', required: false, example: 'foo' })
  async findAll(
    @User() user: IDecodedUser,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: Sort,
    @Query('search') search: string,
  ) {
    return await this.productsService.findAll(
      page,
      limit,
      sort,
      search,
      user.role,
    );
  }

  @Get(':id') // Route with ID parameter
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('admin')
  async remove(@Param('id') id: string) {
    return await this.productsService.removeById(id);
  }
}
