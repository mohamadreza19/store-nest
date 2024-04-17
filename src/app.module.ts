import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';

import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionErrorFactory(error) {
        console.log(error);
        throw error;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'asset', 'public'),
      serveRoot: '/public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'asset', 'private'),
      serveRoot: '/private',
    }),
    FilesModule,
    UsersModule,
    ProductsModule,
    AuthModule,
  ],
  // controllers: [AppController, AuthController, FilesController],
  // providers: [AppService, AuthService, FilesService],
})
export class AppModule {}
