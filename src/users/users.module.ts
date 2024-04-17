import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersEntitny } from './entities/user.entitiy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UsersEntitny }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
