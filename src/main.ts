import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as process from 'node:process';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProd
      ? ['error', 'warn', 'log']
      : ['debug', 'error', 'warn', 'log', 'verbose'],
  });
  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // Configuration Swagger
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Home Cycle Home API')
      .setDescription(
        'API pour la gestion des interventions de réparation de vélos à domicile',
      )
      .setVersion('1.0')
      .addTag('intervention', 'Gestion des interventions')
      .addTag('auth', 'Authentification')
      .addTag('carte', 'Gestion des zones')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.use(cookieParser());
  app.enableCors({
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000')
        .split(',')
        .map((s) => s.trim());
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8081, '0.0.0.0');

  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT || 8081}/api`,
  );
  console.log(
    `📚 Swagger documentation available at: http://localhost:${process.env.PORT || 8081}/swagger`,
  );
}
bootstrap();
