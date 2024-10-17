"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_service_1 = require("./app.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const myService = app.get(app_service_1.AppService);
    app.enableCors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    });
    await app.listen(3200);
    await myService.startTrafficLightCycle();
}
bootstrap();
//# sourceMappingURL=main.js.map