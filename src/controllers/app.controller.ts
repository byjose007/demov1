import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "../services/app.service";
import { Gpio } from "onoff";
import { TrafficLightService } from "../services/traffic-light.service";
import { Intersection } from "../intersection.class";
import { ButtonService } from "../services/button.service";
import { RtcService } from "../services/rtc.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private buttonService: ButtonService,
    private rtcService: RtcService

  ) {}

  @Get("/start")
  async startTrafficLightCycle() {
    await this.appService.startTrafficLightCycle();
    return { message: "Traffic light cycle completed." };
  }

  @Get("/stop")
  async stopTrafficLightCycle() {
    await this.appService.stopCycle();
    return { message: "Traffic light cycle stopped." };
  }

  @Get("/flash")
  async flashMode() {
    await this.appService.flasheo();
    return { message: "Flash mode activated." };
  }

  @Get("/status")
  getTrafficLightStatus() {
    return this.appService.getIntersectionsStatus();
  }

  @Get("/rtc-info")
  getRTCInfo() {
    return {
      status: "success",
      data: this.rtcService.getSystemInfo(),
      timestamp: new Date().toISOString()
    };
  }

}


