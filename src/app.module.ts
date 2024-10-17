import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TrafficLightService } from "./traffic-light.service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ButtonService } from "./button.service";
import { TrafficLightScheduleService } from "./traffic-light-schedule-service/traffic-light-schedule-service";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ButtonService, TrafficLightScheduleService],
})
export class AppModule {}
