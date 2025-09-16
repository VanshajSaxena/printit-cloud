import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationLogger } from './logger/application-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(new ApplicationLogger());

  const config = new DocumentBuilder()
    .setTitle('Juggler Core')
    .setVersion('0.0.1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => console.log(error));
