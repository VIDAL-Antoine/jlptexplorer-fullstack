import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { StripTimestampsInterceptor } from './common/interceptors/strip-timestamps.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new StripTimestampsInterceptor());

  app.enableCors({
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  const config = new DocumentBuilder()
    .setTitle('JLPTExplorer API')
    .setDescription(
      'API for JLPTExplorer — Japanese grammar learning app with contextual examples.',
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:8080', 'Local development')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
    .addTag('sources', 'Sources with contextual scenes')
    .addTag('scenes', 'Contextual scenes that illustrate grammar points')
    .addTag('grammar-points', 'JLPT grammar points')
    .addTag('speakers', 'Character speakers')
    .addTag('transcript-lines', 'Dialogue lines within a scene')
    .addTag(
      'transcript-line-grammar-points',
      'Grammar point annotations on transcript lines',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env['PORT'] ?? 8080);
}
void bootstrap();
