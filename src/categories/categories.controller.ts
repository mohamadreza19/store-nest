import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { ParseObjectIdPipe } from 'src/shared/decorators/parse-object-id.pipe';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth('admin')
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  // @ApiQuery({ name: 'page', required: true, example: 1 })
  // @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({
    name: 'parentId',
    required: false,
    example: 'null | <parentId> ',
  })
  findAll(
    // @Query('page') page: number,
    // @Query('limit') limit: number,
    @Query('parentId') parent_id: string,
  ) {
    return this.categoriesService.findAll(10, 1000000, parent_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
