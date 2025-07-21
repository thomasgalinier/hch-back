import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as process from 'node:process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8081, '0.0.0.0');
}
bootstrap();
