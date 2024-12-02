import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { TrafficLightService } from "./services/traffic-light.service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ButtonService } from "./services/button.service";
import { TrafficLightScheduleService } from "./services/traffic-light-schedule-service/traffic-light-schedule-service";

import { RtcService } from "./services/rtc.service";
import { ErrorHandlingService } from "./services/error-handling.service";
import { TrafficLightGateway } from "./gateways/traffic-light-gateway";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    ButtonService,
    TrafficLightScheduleService,
    TrafficLightGateway,
    RtcService,
    ErrorHandlingService
  ],
})
export class AppModule {}
