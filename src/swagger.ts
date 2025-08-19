import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Home Cycle Home API')
    .setDescription('API pour la gestion des interventions de réparation de vélos à domicile')
    .setVersion('1.0')
    .addTag('intervention', 'Gestion des interventions')
    .addTag('auth', 'Authentification')
    .addTag('forfait', 'Gestion des forfaits')
    .addTag('carte', 'Gestion des zones')
    .addBearerAuth()
    .addCookieAuth('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const [, , filterTag, outFile = 'openapi.json'] = process.argv;
  let outDoc: OpenAPIObject = document;

  if (filterTag) {
    const tag = filterTag;
    const paths: OpenAPIObject['paths'] = {};
    for (const [path, methods] of Object.entries(document.paths)) {
      const filtered: any = {};
      for (const [method, op] of Object.entries(methods ?? {})) {
        if ((op as any)?.tags?.includes(tag)) {
          filtered[method] = op;
        }
      }
      if (Object.keys(filtered).length) {
        (paths as any)[path] = filtered;
      }
    }
    outDoc = { ...document, tags: document.tags?.filter(t => t.name === tag), paths } as OpenAPIObject;
  }

  writeFileSync(outFile, JSON.stringify(outDoc, null, 2), { encoding: 'utf-8' });
  await app.close();
}

bootstrap();
