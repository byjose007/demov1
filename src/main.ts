import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const myService = app.get(AppService);
  // Configuración CORS
  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  });
  await app.listen(3200);

  await myService.startTrafficLightCycle();
}
bootstrap();
