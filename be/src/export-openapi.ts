import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createSwaggerDocument } from './swagger.config.js';

async function exportOpenApi() {
  process.env.SKIP_DB_CONNECT = 'true';
  const { AppModule } = await import('./app.module.js');

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');

  const document = createSwaggerDocument(app);

  const outputPath = resolve(import.meta.dirname, '../../openapi.json');
  const jsonContent =
    JSON.stringify(document, null, 2).replace(/\r\n/g, '\n') + '\n';
  writeFileSync(outputPath, jsonContent, { encoding: 'utf8' });

  await app.close();
  console.log('Exported openapi.json successfully');
}

await exportOpenApi();
