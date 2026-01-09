import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApplicationLogger } from './logger/application-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(new ApplicationLogger());

  const config = new DocumentBuilder()
    .setTitle('Printly')
    .setDescription('Printly Cloud API.')
    .setVersion('0.1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
      autoTagControllers: true,
    });

  SwaggerModule.setup('docs', app, documentFactory, {
    explorer: true,
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  const origins = [
    'https://app.print-ly.ink',
    'https://testing--printly-app.netlify.app',
    'http://localhost:5173', // electron renderer
    'http://localhost:8080', // pwa
  ];

  app.enableCors({
    origin: origins,
  });
  const server = app.getHttpAdapter().getInstance() as ExpressAdapter;
  server.disable('etag');
  server.disable('x-powered-by');
  app.enableShutdownHooks();
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((error: unknown) => {
  console.log(error);
});
