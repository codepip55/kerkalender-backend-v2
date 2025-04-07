import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set cookie options
  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));

  // Enable CORS
  app.enableCors({
    origin: [/pepijncolenbrander\.com$/, /localhost(:\d+)?$/],
    credentials: true
  });

  // Configure validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable helmet for security
  // @ts-expect-error - helmet is not typed
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
