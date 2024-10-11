import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const myService = app.get(AppService);
  await app.listen(3000);

  await myService.startTrafficLightCycle();
}
bootstrap();
