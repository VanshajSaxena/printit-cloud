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
import { networkInterfaces } from 'os';

function getNetworkAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(new ApplicationLogger());
  const port = process.env.PORT;

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
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'https://deploy-preview-40--printly-app.netlify.app',
      'https://testing--printly-app.netlify.app',
    ],
  });
  const server = app.getHttpAdapter().getInstance() as ExpressAdapter;
  server.disable('etag');
  server.disable('x-powered-by');
  app.enableShutdownHooks();
  try {
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`NestJS listening on port ${port}`);
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}
bootstrap().catch((error: unknown) => {
  console.log(error);
});
