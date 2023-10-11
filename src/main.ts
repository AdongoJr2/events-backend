import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT;

  const app = await NestFactory.create(AppModule);

  // setting global path prefix
  app.setGlobalPrefix('api/v1');

  // enable cors
  app.enableCors();

  await app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
  });
}
bootstrap();
