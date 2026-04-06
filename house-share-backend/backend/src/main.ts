import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

    // Starts the server
    const app = await NestFactory.create(AppModule);

    // Boots NestJS app using AppModules as root
    app.enableCors();

    // Allows Angular to make HTTP requests to NestJS
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

    // Listens for HTTP requests on port 3000
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
