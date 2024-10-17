import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { Gpio } from "onoff";
import { TrafficLightService } from "./traffic-light.service";
import { Intersection } from "./intersection.class";
import { ButtonService } from "./button.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private buttonService: ButtonService
  ) {}

  @Get("/start")
  async startTrafficLightCycle() {
    // await this.appService.createIntersections()
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

  @Post("/update-timings")
  updateTimings(
    @Body() timings: { green: number; yellow: number; red: number }
  ) {
    this.appService.updateIntersectionTimings(
      timings.green,
      timings.yellow,
      timings.red
    );
    return { message: "Timings updated successfully." };
  }

  @Get("/startPeaton")
  async startPeaton() {
    // this.buttonService.onModuleInit()
    await this.appService.startPeaton();
    // Crea una instancia de Gpio para el pin de botón, con la opción 'in' para leer su valor
  }
}
