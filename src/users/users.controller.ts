import {
  Controller,
  Get,
  Res,
  Req,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators';
import { IDecodedUser } from 'src/shared/interfaces';
import { UserGuard } from 'src/auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: Response) {
    const user = await this.userService.findAll();
    res.json(user);
  }
  @Post()
  async create(@Body() user: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.create(user);
    res.json(result);
  }

  @Get('profiles')
  @ApiBearerAuth('user')
  @UseGuards(UserGuard)
  getProfile(@User() user: IDecodedUser) {
    return this.userService.getProfileByUserId(user.id);
  }

  @Get('core-info')
  @ApiBearerAuth('user')
  @UseGuards(UserGuard)
  getUserCoreInfo(@User() user: IDecodedUser) {
    return this.userService.findById(user.id);
  }
  @Put(':id')
  async update(
    @Body() user: CreateUserDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateById(id, user);

    if (!result) {
      return res.status(404).json({
        message: 'User with that ID was not found',
      });
    }
    return res.status(204).json({});
  }
}
