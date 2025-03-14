import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');  // This will set the global prefix to /api
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
