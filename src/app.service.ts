import { HttpService } from "@nestjs/axios";
import { HttpCode, Injectable, OnModuleInit } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Durations, Intersection } from "./intersection.class";
import { TrafficLightVisualizer } from "./traffic-light-visualizer-log";

@Injectable()
export class AppService implements OnModuleInit {
  isFlaseo = false;
  isInit = false;
  shouldContinueCycle: boolean = true;
  intersection1: Intersection;
  intersection2: Intersection;
  intersection3: Intersection;
  intersection4: Intersection;
  peaton1: Intersection;

  private normalTimings: { red: number; yellow: number; green: number };
  private peakTimings: { red: number; yellow: number; green: number };

  constructor() {
    // Initialize with default values
    this.normalTimings = { red: 1, yellow: 3, green: 30 }; // Normal schedul 35 seconds
    this.peakTimings = { red: 1, yellow: 3, green: 30 }; // Peak schedul 45 seconds
  }

  onModuleInit() {
    console.log("Inicializando intersecciones...");
    const initialTimings = this.getInitialTimings();

    this.intersection1 = new Intersection(17, 27, 22, initialTimings);
    this.intersection2 = new Intersection(6, 13, 19, initialTimings);
    this.intersection3 = new Intersection(12, 16, 20, initialTimings);
    //  this.intersection4 = new Intersection(24, 25, 26, { red: 1000, yellow: 2000, green: 3000 });

    this.peaton1 = new Intersection(21, 0, 26, {
      red: 1,
      yellow: 0,
      green: 10,
    });
  }

  updateNormalTimings(
    greenDuration: number,
    yellowDuration: number,
    redDuration: number
  ) {
    this.normalTimings = {
      red: redDuration,
      yellow: yellowDuration,
      green: greenDuration,
    };
  }

  updatePeakTimings(
    greenDuration: number,
    yellowDuration: number,
    redDuration: number
  ) {
    this.peakTimings = {
      red: redDuration,
      yellow: yellowDuration,
      green: greenDuration,
    };
  }

  getNormalTimings() {
    return this.normalTimings;
  }

  getPeakTimings() {
    return this.peakTimings;
  }

  getIntersectionsStatus() {
    const statusObject = {
      intersection1: this.intersection1.getStatus(),
      intersection2: this.intersection2.getStatus(),
      intersection3: this.intersection3.getStatus(),
    };

    // Convertir el objeto a un array
    return Object.values(statusObject);
  }

  private getInitialTimings(): { red: number; yellow: number; green: number } {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Fin de semana (sábado y domingo)
    if (day === 0 || day === 6) {
      console.log("getInitialTimings ---> Horario normal todo el día");
      return this.normalTimings; // Horario normal todo el día
    }

    // Días de semana (lunes a viernes)
    if (
      (hour === 6 && minute >= 30) ||
      hour === 7 ||
      (hour === 8 && minute <= 30) ||
      (hour === 11 && minute >= 30) ||
      hour === 12 ||
      (hour === 13 && minute <= 30) ||
      (hour === 16 && minute >= 30) ||
      hour === 17 ||
      hour === 18 ||
      (hour === 19 && minute <= 30)
    ) {
      console.log("getInitialTimings ---> Hora pico");
      return this.peakTimings; // Hora pico
    } else if (hour >= 22 || hour < 5) {
      console.log("getInitialTimings ---> Modo flasheo");
      return { red: 1, yellow: 1, green: 1 }; // Modo flasheo (los tiempos exactos se manejan en la función flasheo)
    } else {
      console.log("getInitialTimings ---> Horario normal");
      return this.normalTimings; // Horario normal
    }
  }

  updateIntersectionTimings(
    greenDuration: number,
    yellowDuration: number,
    redDuration: number
  ) {
    const newDurations = {
      red: redDuration,
      yellow: yellowDuration,
      green: greenDuration,
    };
    this.intersection1.updateDurations(newDurations);
    this.intersection2.updateDurations(newDurations);
    this.intersection3.updateDurations(newDurations);
    // this.intersection4.updateDurations(newDurations);
    // Nota: No actualizamos los tiempos del semáforo peatonal (peaton1) aquí
  }

  async startTrafficLightCycle(isInit = true) {

    
    this.isInit = isInit;
    this.shouldContinueCycle = true;
    this.isFlaseo = false;
    await this.stopTraffic(true, false);

    try {
      while (this.isInit) {
        if (this.isFlaseo) break;

        // Fase inicial - todos rojos
        TrafficLightVisualizer.drawTrafficLight(1, "red", "1");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "1");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "1");

        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        await this.sleep(this.intersection1.getRedDuration);

        if (this.isFlaseo) break;

        // Fase 1 - Verde para intersección 1
        TrafficLightVisualizer.drawTrafficLight(1, "green", "2");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "2");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "2");

        this.intersection1.turnGreen();
        this.intersection2.turnRed();
        await this.sleep(this.intersection1.getGreenDuration);

        if (this.isFlaseo) break;

        // Fase 1 - Amarillo para intersección 1
        TrafficLightVisualizer.drawTrafficLight(1, "yellow", "3");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "3");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "3");

        this.intersection1.turnYellow();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        await this.sleep(this.intersection1.getYellowDuration);

        if (this.isFlaseo) break;

        // Todos rojos
        TrafficLightVisualizer.drawTrafficLight(1, "red", "4");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "4");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "4");

        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        await this.sleep(this.intersection2.getRedDuration);

        if (this.isFlaseo) break;

        // Fase 2 - Verde para intersección 2
        TrafficLightVisualizer.drawTrafficLight(1, "red", "5");
        TrafficLightVisualizer.drawTrafficLight(2, "green", "5");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "5");

        this.intersection1.turnRed();
        this.intersection2.turnGreen();
        this.intersection3.turnRed();
        await this.sleep(this.intersection2.getGreenDuration);

        if (this.isFlaseo) break;

        // Fase 2 - Amarillo para intersección 2
        TrafficLightVisualizer.drawTrafficLight(1, "red", "6");
        TrafficLightVisualizer.drawTrafficLight(2, "yellow", "6");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "6");

        this.intersection1.turnRed();
        this.intersection2.turnYellow();
        this.intersection3.turnRed();
        await this.sleep(this.intersection2.getYellowDuration);

        if (this.isFlaseo) break;

        // Todos rojos
        TrafficLightVisualizer.drawTrafficLight(1, "red", "7");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "7");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "7");

        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        await this.sleep(this.intersection2.getRedDuration);

        if (this.isFlaseo) break;

        // Fase 3 - Verde para intersección 3
        TrafficLightVisualizer.drawTrafficLight(1, "red", "8");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "8");
        TrafficLightVisualizer.drawTrafficLight(3, "green", "8");

        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnGreen();
        await this.sleep(this.intersection3.getGreenDuration);

        if (this.isFlaseo) break;

        // Fase 3 - Amarillo para intersección 3
        TrafficLightVisualizer.drawTrafficLight(1, "red", "9");
        TrafficLightVisualizer.drawTrafficLight(2, "red", "9");
        TrafficLightVisualizer.drawTrafficLight(3, "yellow", "9");

        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnYellow();
        await this.sleep(this.intersection3.getYellowDuration);
      }

      if (!this.isFlaseo) {
        await this.stopTraffic(false, false);
      }
      console.log("Salir del ciclo de semáforos");
    } catch (error) {
      await this.stopTraffic(false, false);
      console.log("Error en el ciclo de semáforos:", error);
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Método para detener el ciclo infinito en una intersección específica
  async stopTraffic(init = false, flash = false): Promise<any> {
    this.isInit = init;
    this.isFlaseo = flash;
    this.shouldContinueCycle = init;
    try {
      console.log("detener semáforo", this.isFlaseo);
      return await Promise.all([
        await this.intersection1.stopTrafficLightCycle(),
        await this.intersection2.stopTrafficLightCycle(),
        await this.intersection3.stopTrafficLightCycle(),
        // await this.intersection4.stopTrafficLightCycle(),
        await this.peaton1.stopTrafficLightCycle(),
      ]);
    } catch (e) {
      console.log(e, "error");
    }
  }

  async stopCycle() {
    await this.stopTraffic();
    this.shouldContinueCycle = false;
  }

  async startPeaton() {
    console.log("iniciar peaton");

    this.intersection1.stopTrafficLightCycle();
    this.intersection2.stopTrafficLightCycle();

    this.intersection1.turnGreen(); // inteserection => rojo
    this.intersection2.turnRed();
    // this.intersection3.turnRed();
    // this.intersection4.turnRed();
    this.peaton1.turnGreen(); // peaton => verde
    await this.sleep(15000);
    // this.stopTraffic()
    await this.intersection1.stopTrafficLightCycle();
    await this.intersection2.stopTrafficLightCycle();
    await this.peaton1.stopTrafficLightCycle();
    await this.startTrafficLightCycle();
  }

  async flasheo(isFlaseo = true) {
    await this.stopTraffic(false, true);
    this.isFlaseo = isFlaseo;
    console.log("Iniciando flasheo", this.isFlaseo);

    if (!this.isFlaseo) {
      console.log("apagar flasheo", this.isFlaseo);
      await this.stopTraffic(false, isFlaseo);
      return;
    }

    while (this.isFlaseo) {
      try {
        TrafficLightVisualizer.drawTrafficLight(1, "yellow", "F");
        TrafficLightVisualizer.drawTrafficLight(2, "yellow", "F");
        TrafficLightVisualizer.drawTrafficLight(3, "red", "F");

        await this.intersection1.turnYellow();
        await this.intersection2.turnYellow();
        await this.intersection3.turnRed();
        await this.sleep(1000);

        TrafficLightVisualizer.drawTrafficLight(1, "off", "F");
        TrafficLightVisualizer.drawTrafficLight(2, "off", "F");
        TrafficLightVisualizer.drawTrafficLight(3, "off", "F");

        await this.intersection1.stopTrafficLightCycle();
        await this.intersection2.stopTrafficLightCycle();
        await this.intersection3.stopTrafficLightCycle();
        await this.sleep(5000);
      } catch (e) {
        console.log(e, "error");
      }
    }
    await this.stopTraffic(false, false);
  }
}
