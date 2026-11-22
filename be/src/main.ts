import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { createSwaggerDocument } from './swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  app.setGlobalPrefix('api');

  const frontendUrls = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  if (frontendUrls.length > 0) {
    app.enableCors({
      origin: frontendUrls.length === 1 ? frontendUrls[0] : frontendUrls,
      credentials: true,
    });
  }

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = createSwaggerDocument(app);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
