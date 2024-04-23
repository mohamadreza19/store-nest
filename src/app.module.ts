import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';

import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionErrorFactory(error) {
        console.log(error);
        throw error;
      },
    }),

    FilesModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
  ],
  // controllers: [AppController, AuthController, FilesController],
  // providers: [AppService, AuthService, FilesService],
})
export class AppModule {}
