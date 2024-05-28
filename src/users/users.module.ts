import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import UsersEntitny from './entities/user.entitiy';
import ProfilesEntitny from './entities/profiles.entitiy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UsersEntitny }]),
    MongooseModule.forFeature([{ name: 'profiles', schema: ProfilesEntitny }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
