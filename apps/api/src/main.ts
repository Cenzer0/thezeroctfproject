import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", 'data:'],
        "connect-src": ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['content-type','authorization','x-csrf-token'],
  });

  app.use(cookieParser());
  app.use('/api', csurf({ cookie: { httpOnly: true, sameSite: 'lax' } }));

  const config = new DocumentBuilder()
    .setTitle('CTF Platform API')
    .setDescription('API documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`);
  Logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
