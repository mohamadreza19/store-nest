import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new GlobalExceptionFilter());


  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  const Swaggerconfig = new DocumentBuilder()
  .setTitle('Store')
  .setDescription('The store API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Authorization',
    },
    'user',
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Authorization',
    },
    'admin',
  )
  .build();
  const document = SwaggerModule.createDocument(app, Swaggerconfig);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
}
bootstrap();
