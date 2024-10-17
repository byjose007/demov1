import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AppService } from "../app.service";

@Injectable()
export class TrafficLightScheduleService {
  constructor(private readonly appService: AppService) {}

  private isFlashMode: boolean = false;

  // Horarios para días de semana (Lunes a Viernes)
  @Cron("0 5 * * 1-5")
  async startWeekdayNormalHours() {
    if (this.isWeekday()) {
      console.log("Iniciando horario normal en día de semana - 5:00 AM");
      await this.setNormalSchedule();
    }
  }

  @Cron("30 6 * * 1-5")
  async startWeekdayPeakHours1() {
    if (this.isWeekday()) {
      console.log("Iniciando hora pico en día de semana - 6:30 AM");
      await this.setPeakSchedule();
    }
  }

  @Cron("31 8 * * 1-5")
  async startWeekdayNormalHours2() {
    if (this.isWeekday()) {
      console.log("Volviendo a horario normal en día de semana - 8:31 AM");
      await this.setNormalSchedule();
    }
  }

  @Cron("30 11 * * 1-5")
  async startWeekdayPeakHours2() {
    if (this.isWeekday()) {
      console.log("Iniciando hora pico en día de semana - 11:30 AM");
      await this.setPeakSchedule();
    }
  }

  @Cron("31 13 * * 1-5")
  async startWeekdayNormalHours3() {
    if (this.isWeekday()) {
      console.log("Volviendo a horario normal en día de semana - 13:31 PM");
      await this.setNormalSchedule();
    }
  }

  @Cron("30 16 * * 1-5")
  async startWeekdayPeakHours3() {
    if (this.isWeekday()) {
      console.log("Iniciando hora pico en día de semana - 16:30 PM");
      await this.setPeakSchedule();
    }
  }

  @Cron("31 19 * * 1-5")
  async startWeekdayNormalHours4() {
    if (this.isWeekday()) {
      console.log("Volviendo a horario normal en día de semana - 19:31 PM");
      await this.setNormalSchedule();
    }
  }

  @Cron("0 22 * * 1-5")
  async startWeekdayFlashMode() {
    if (this.isWeekday()) {
      console.log("Iniciando modo flasheo en día de semana - 22:00 PM");
      await this.setFlashMode();
    }
  }

  // Horarios para fines de semana (Sábado y Domingo)
  @Cron("0 5 * * 0,6")
  async startWeekendNormalHours() {
    if (!this.isWeekday()) {
      console.log("Iniciando horario normal en fin de semana - 5:00 AM");
      await this.setNormalSchedule();
    }
  }

  @Cron("0 22 * * 0,6")
  async startWeekendFlashMode() {
    if (!this.isWeekday()) {
      console.log("Iniciando modo flasheo en fin de semana - 22:00 PM");
      await this.setFlashMode();
    }
  }

  private async setNormalSchedule() {
    this.isFlashMode = false;
    const normalTimings = this.appService.getNormalTimings();
    await this.updateTrafficLightTiming(
      normalTimings.green,
      normalTimings.yellow,
      normalTimings.red
    );
  }

  private async setPeakSchedule() {
    this.isFlashMode = false;
    const peakTimings = this.appService.getPeakTimings();
    await this.updateTrafficLightTiming(
      peakTimings.green,
      peakTimings.yellow,
      peakTimings.red
    );
  }

  private async setFlashMode() {
    this.isFlashMode = true;
    await this.appService.flasheo(true);
  }

  private async updateTrafficLightTiming(
    greenDuration: number,
    yellowDuration: number,
    redDuration: number
  ) {
    this.appService.updateIntersectionTimings(
      greenDuration,
      yellowDuration,
      redDuration
    );
    console.log(
      `Actualizando tiempos: Verde ${greenDuration}s, Amarillo ${yellowDuration}s, Rojo ${redDuration}s`
    );
    await this.appService.stopTraffic(false, false);
    await this.appService.startTrafficLightCycle(true);
  }

  private isWeekday(): boolean {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  }
}
