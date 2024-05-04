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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Sort, SortEnum } from 'src/shared/interfaces';

import { IsObjectId } from 'src/shared/decorators/is-object-id.decorator';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth('admin')
  @Get('statistics')
  async getStatistics() {
    return await this.adminService.getStatistics();
  }
  @UseGuards(AdminGuard)
  @ApiBearerAuth('admin')
  @Get('users')
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sort', required: false, enum: SortEnum, enumName: 'Sort' })
  @ApiQuery({ name: 'search', required: false, example: 'username' })
  async findAllUsrs(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: Sort,
    @Query('search') search: string,
  ) {
    return await this.usersService.findAll(page, limit, sort, search);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth('admin')
  @Get('users/:id')
  async findUserByid(@Param('id') id: string) {
    const result = await this.usersService.findById(id);

    console.log(result);
    return result;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
