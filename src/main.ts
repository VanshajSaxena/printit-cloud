import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
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

  // NOTE: these options will differ in production
  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const whitelist = [
        'https://app.print-ly.ink',
        'https://dev--printly-app.netlify.app',
        'http://localhost:5173',
        'http://localhost:8100',
      ];

      const netlifyRegex = /^https:\/\/.*--printly-app\.netlify\.app$/;

      if (!origin || whitelist.includes(origin) || netlifyRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  app.enableCors(corsOptions);
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
