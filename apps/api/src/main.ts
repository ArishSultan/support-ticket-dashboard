import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { appConfig, AppMode, type AppConfigType } from './app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    // bodyParser: false,
  });

  const $appConfig = app.get<AppConfigType>(appConfig.KEY);

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  // CORS
  app.enableCors({
    origin: $appConfig.appUrl,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'Cookie'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  if ($appConfig.mode === AppMode.DEV) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Support Ticket Dashboard API')
      .setDescription('Support Ticket Dashboard API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    app.use('/reference', apiReference({ content: document }));

    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api/docs-json', (_, res) => res.json(document));
  }

  await app.listen($appConfig.port, $appConfig.host);

  logger.log(
    `🚀 API running at http://${$appConfig.host}:${$appConfig.port}/api`,
  );
  logger.log(
    `📄 Swagger docs at http://${$appConfig.host}:${$appConfig.port}/api/docs`,
  );
}

bootstrap().catch(console.error);
