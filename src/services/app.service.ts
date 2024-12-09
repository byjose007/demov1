import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Intersection } from "../intersection.class";
import { TrafficLightVisualizer } from "../shared/traffic-light-visualizer-log";
import { TrafficMode } from "../enums/traffic-mode.enum";
import { RtcService } from "./rtc.service";
import { BehaviorSubject, Observable, retry, share, Subscription } from "rxjs";
import { TimingConfig, TrafficState } from "src/interfaces/trafic-state.interface";
import { TrafficLightGateway } from "src/gateways/traffic-light-gateway";

/**
 * Configuración de tiempos para los semáforos
 */


/**
 * Configuración de una intersección
 */
interface IntersectionConfig {
  id: number;
  pins: {
    red: number;
    yellow: number;
    green: number;
  };
  timings: TimingConfig;
}

/**
 * Servicio principal para el control de tráfico
 * Maneja múltiples intersecciones y diferentes modos de operación
 */
@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private trafficStateSubject = new BehaviorSubject<TrafficState>(null);
  private cycleSubscription: Subscription;

  // Configuraciones de tiempo
  private readonly FLASH_INTERVAL = 1000;
  private readonly FLASH_OFF_DURATION = 1000;
  private readonly PEDESTRIAN_CROSSING_DURATION = 15000;

  // Timings predeterminados
  private readonly normalTimings: TimingConfig = {
    red: 1,
    yellow: 4,
    green: 35,
  };
  private readonly peakTimings: TimingConfig = { red: 1, yellow: 4, green: 45 };
  private readonly flashTimings: TimingConfig = { red: 1, yellow: 1, green: 1 };

  // Estado del sistema
  private isFlaseo = false;
  private isInit = false;
  private shouldContinueCycle = true;
  private currentMode: TrafficMode = TrafficMode.NORMAL;

  // Intersecciones
  private intersections: Map<number, Intersection> = new Map();
  private pedestrianCrossings: Map<number, Intersection> = new Map();

  // Observable público para el estado del tráfico
  public trafficState$ = this.trafficStateSubject.asObservable();

  constructor(
    private rtcService: RtcService,
    private trafficLightGateway: TrafficLightGateway
  ) {
    this.logger.log("Inicializando servicio de control de tráfico");
  }

  async onModuleInit() {
    try {
      await this.initializeSystem();
      await this.startTrafficSystem();
    } catch (error) {
      this.logger.error("Error en la inicialización:", error);
    }
  }

  private async initializeSystem() {
    const intersectionConfigs: IntersectionConfig[] = [
      {
        id: 1,
        pins: { red: 17, yellow: 27, green: 22 },
        timings: this.getInitialTimings(),
      },
      {
        id: 2,
        pins: { red: 6, yellow: 13, green: 19 },
        timings: this.getInitialTimings(),
      },
      {
        id: 3,
        pins: { red: 12, yellow: 16, green: 20 },
        timings: this.getInitialTimings(),
      },
    ];

    for (const config of intersectionConfigs) {
      const intersection = new Intersection(
        config.id,
        config.pins.red,
        config.pins.yellow,
        config.pins.green,

        config.timings
      );

      this.intersections.set(config.id, intersection);
    }

    this.updateTrafficState();
    this.logger.log("Sistema inicializado correctamente");
  }

  async startTrafficLightCycle() {
    this.stopCycle();

    const cycle$ = new Observable<TrafficState>(observer => {
      let isRunning = true;

      const runCycle = async () => {
        while (isRunning) {
          try {
            await this.executeTrafficCycle();
            const state = this.getTrafficState();
            observer.next(state);

            const newMode = this.determineTrafficMode();
            if (newMode !== this.currentMode) {
              await this.handleModeChange(newMode);
            }
          } catch (error) {
            this.logger.error('Error en ciclo:', error);
            observer.error(error);
          }
        }
      };

      runCycle();

      return () => {
        isRunning = false;
        this.stopAllTraffic(false, false);
      };
    }).pipe(
      retry(3),
      share()
    );

    this.cycleSubscription = cycle$.subscribe({
      next: (state) => {
        this.trafficStateSubject.next(state);
        this.trafficLightGateway.broadcastStatus(state);
      },
      error: (error) => {
        this.logger.error('Error en ciclo de tráfico:', error);
        this.stopCycle();
      }
    });

    return { message: "Traffic light cycle started." };
  }

 public stopCycle() {
    if (this.cycleSubscription) {
      this.cycleSubscription.unsubscribe();
    }
    this.stopAllTraffic(false, false);
    return { message: "Traffic light cycle stopped." };
  }

  private getTrafficState(): TrafficState {
    const intersectionStates = {};
    this.intersections.forEach((intersection, id) => {
      intersectionStates[id] = intersection.getStatus();
    });

    return {
      intersections: intersectionStates,
      currentMode: this.currentMode,
      timestamp: Date.now()
    };
  }

  private updateTrafficState() {
    const state = this.getTrafficState();
    this.trafficStateSubject.next(state);
    this.trafficLightGateway.broadcastStatus(state);
  }

  getNormalTimings() {
    return this.normalTimings;
  }

  getPeakTimings() {
    return this.peakTimings;
  }

  getFlashTimings() {
    return this.flashTimings;
  }

  /**
   * Inicializa el sistema de tráfico
   */
  // private async initializeSystem() {
  //   // Configuración de intersecciones principales
  //   const intersectionConfigs: IntersectionConfig[] = [
  //     {
  //       id: 1,
  //       pins: { red: 17, yellow: 27, green: 22 },
  //       timings: this.getInitialTimings(),
  //     },
  //     {
  //       id: 2,
  //       pins: { red: 6, yellow: 13, green: 19 },
  //       timings: this.getInitialTimings(),
  //     },
  //     {
  //       id: 3,
  //       pins: { red: 12, yellow: 16, green: 20 },
  //       timings: this.getInitialTimings(),
  //     },
  //   ];

  //   // Configuración de cruces peatonales
  //   const pedestrianConfigs: IntersectionConfig[] = [
  //     {
  //       id: 1,
  //       pins: { red: 21, yellow: 0, green: 26 },
  //       timings: this.pedestrianTimings,
  //     },
  //   ];

  //   // Inicializar intersecciones
  //   for (const config of intersectionConfigs) {
  //     const intersection = new Intersection(
  //       config.pins.red,
  //       config.pins.yellow,
  //       config.pins.green,
  //       config.timings
  //     );
  //     this.intersections.set(config.id, intersection);
  //   }

  //   // Inicializar cruces peatonales
  //   for (const config of pedestrianConfigs) {
  //     const crossing = new Intersection(
  //       config.pins.red,
  //       config.pins.yellow,
  //       config.pins.green,
  //       config.timings
  //     );
  //     this.pedestrianCrossings.set(config.id, crossing);
  //   }

  //   this.logger.log("Sistema inicializado correctamente");
  // }

  /**
   * Inicia el sistema de tráfico en el modo apropiado
   */
  private async startTrafficSystem() {
    this.currentMode = this.determineTrafficMode();
    this.logModeChange(this.currentMode);

    switch (this.currentMode) {
      case TrafficMode.FLASH:
        await this.flasheo();
        break;
      case TrafficMode.PEAK:
      case TrafficMode.NORMAL:
        await this.startTrafficLightCycle();
        break;
    }
  }

  /**
   * Determina el modo de operación según la hora y día
   */
  private determineTrafficMode(): TrafficMode {
    const now = this.rtcService.getCurrentTime();
    const hour = now.getHours();
    const day = now.getDay();
    const minute = now.getMinutes();

    if (hour >= 22 || hour < 5) {
      return TrafficMode.FLASH;
    }

    if (day === 0 || day === 6) {
      return TrafficMode.NORMAL;
    }

    return this.isPeakHour(hour, minute)
      ? TrafficMode.PEAK
      : TrafficMode.NORMAL;
  }

  /**
   * Verifica si es hora pico
   */
  private isPeakHour(hour: number, minute: number): boolean {
    const peakHours = [
      { start: { hour: 6, minute: 30 }, end: { hour: 8, minute: 30 } },
      { start: { hour: 11, minute: 30 }, end: { hour: 13, minute: 30 } },
      { start: { hour: 16, minute: 30 }, end: { hour: 19, minute: 30 } },
    ];

    return peakHours.some((peak) => {
      const currentTime = hour * 60 + minute;
      const startTime = peak.start.hour * 60 + peak.start.minute;
      const endTime = peak.end.hour * 60 + peak.end.minute;
      return currentTime >= startTime && currentTime <= endTime;
    });
  }

  /**
   * Obtiene la configuración de tiempos inicial
   */
  private getInitialTimings(): TimingConfig {
    switch (this.determineTrafficMode()) {
      case TrafficMode.PEAK:
        return this.peakTimings;
      case TrafficMode.FLASH:
        return this.flashTimings;
      default:
        return this.normalTimings;
    }
  }

  /**
   * Ciclo principal de control de tráfico
   */
  // async startTrafficLightCycle(isInit = true) {
  //   try {
  //     this.isInit = isInit;
  //     this.shouldContinueCycle = true;
  //     this.isFlaseo = false;
  //     await this.stopAllTraffic(true, false);

  //     while (this.shouldContinueCycle && this.isInit) {
  //       if (this.isFlaseo) break;

  //       const newMode = this.determineTrafficMode();
  //       if (newMode !== this.currentMode) {
  //         this.currentMode = newMode;
  //         this.logModeChange(newMode);
  //         if (newMode === TrafficMode.FLASH) {
  //           await this.flasheo();
  //           break;
  //         }
  //       }

  //       await this.executeTrafficCycle();
  //     }
  //   } catch (error) {
  //     this.logger.error("Error en el ciclo de tráfico:", error);
  //     await this.stopAllTraffic(false, false);
  //   }
  // }

  /**
   * Modo de flasheo para horario nocturno
   */
  async flasheo(isFlaseo = true) {
    try {
      this.isFlaseo = isFlaseo;
      await this.stopAllTraffic(false, true);

      while (this.isFlaseo) {
        const newMode = this.determineTrafficMode();
        if (newMode !== TrafficMode.FLASH) {
          await this.startTrafficLightCycle();
          break;
        }

        await this.executeFlashCycle();
      }
    } catch (error) {
      this.logger.error("Error en modo flasheo:", error);
      await this.stopAllTraffic(false, false);
    }
  }

  /**
   * Controla las luces en modo flasheo
   */
  private async setFlashingLights(on: boolean) {
    for (const [id, intersection] of this.intersections) {
      const color = id === 3 ? "red" : "yellow";
      TrafficLightVisualizer.drawTrafficLight(id, on ? color : "off", "F");

      if (on) {
        await intersection[
          `turn${color.charAt(0).toUpperCase() + color.slice(1)}`
        ]();
      } else {
        await intersection.stopTrafficLightCycle();
      }
    }
  }

  /**
   * Detiene todo el tráfico
   */
  private async stopAllTraffic(init = false, flash = false): Promise<void> {
    try {
      this.isInit = init;
      this.isFlaseo = flash;
      this.shouldContinueCycle = init;

      const promises = [
        ...Array.from(this.intersections.values()).map((i) =>
          i.stopTrafficLightCycle()
        ),
        ...Array.from(this.pedestrianCrossings.values()).map((p) =>
          p.stopTrafficLightCycle()
        ),
      ];

      await Promise.all(promises);
    } catch (error) {
      this.logger.error("Error al detener el tráfico:", error);
    }
  }

  /**
   * Obtiene el estado actual de todas las intersecciones
   */
  getIntersectionsStatus() {
    const status = {};
    this.intersections.forEach((intersection, id) => {
      status[`intersection${id}`] = intersection.getStatus();
    });
    return Object.values(status);
  }

  /**
   * Métodos auxiliares
   */
  private logModeChange(mode: TrafficMode) {
    this.logger.log(`Cambio de modo: ${mode} - ${this.rtcService.getCurrentTime().toISOString()}`);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRedDuration(): number {
    return this.currentMode === TrafficMode.PEAK
      ? this.peakTimings.red * 1000
      : this.normalTimings.red * 1000;
  }

  private getYellowDuration(): number {
    return this.currentMode === TrafficMode.PEAK
      ? this.peakTimings.yellow * 1000
      : this.normalTimings.yellow * 1000;
  }

  private getGreenDuration(): number {
    return this.currentMode === TrafficMode.PEAK
      ? this.peakTimings.green * 1000
      : this.normalTimings.green * 1000;
  }

  /**
   * API pública para el controlador
   */
  // async stopCycle() {
  //   await this.stopAllTraffic();
  //   this.shouldContinueCycle = false;
  // }

  /**
   * Métodos para actualizar configuraciones
   */
  updateTimings(mode: TrafficMode, timings: TimingConfig) {
    if (mode === TrafficMode.PEAK) {
      Object.assign(this.peakTimings, timings);
    } else {
      Object.assign(this.normalTimings, timings);
    }

    this.logger.log(`Tiempos actualizados para modo ${mode}`);
  }

  /**
   * Método para establecer el estado de una intersección específica
   */
  private async setIntersectionPhase(
    intersectionId: number,
    phase: "red" | "yellow" | "green"
  ) {
    const intersection = this.intersections.get(intersectionId);
    if (!intersection) {
      this.logger.error(`Intersección ${intersectionId} no encontrada`);
      return;
    }

    // Establecer todas las demás intersecciones en rojo
    for (const [id, otherIntersection] of this.intersections) {
      if (id !== intersectionId) {
        TrafficLightVisualizer.drawTrafficLight(
          id,
          "red",
          String(intersectionId)
        );
        await otherIntersection.turnRed();
      }
    }

    // Establecer la fase para la intersección especificada
    TrafficLightVisualizer.drawTrafficLight(
      intersectionId,
      phase,
      String(intersectionId)
    );
    switch (phase) {
      case "red":
        await intersection.turnRed();
        break;
      case "yellow":
        await intersection.turnYellow();
        break;
      case "green":
        await intersection.turnGreen();
        break;
    }
  }

  /**
   * Método para establecer todas las intersecciones en un estado específico
   */
  private async setAllIntersections(phase: "red" | "yellow" | "green") {
    const promises = [];

    for (const [id, intersection] of this.intersections) {
      TrafficLightVisualizer.drawTrafficLight(id, phase, "A");

      switch (phase) {
        case "red":
          promises.push(intersection.turnRed());
          break;
        case "yellow":
          promises.push(intersection.turnYellow());
          break;
        case "green":
          promises.push(intersection.turnGreen());
          break;
      }
    }

    await Promise.all(promises);
  }

  /**
   * Implementación completa del ciclo de tráfico
   */
  private async executeTrafficCycle() {
    try {
      // Fase 1: Todos rojos
      await this.setAllIntersections("red");
      await this.sleep(this.getRedDuration());
      if (this.isFlaseo) return;

      // Fase 2: Primera intersección verde
      await this.setIntersectionPhase(1, "green");
      await this.sleep(this.getGreenDuration());
      if (this.isFlaseo) return;

      await this.setIntersectionPhase(1, "yellow");
      await this.sleep(this.getYellowDuration());
      if (this.isFlaseo) return;

      // Fase de transición
      await this.setAllIntersections("red");
      await this.sleep(this.getRedDuration());
      if (this.isFlaseo) return;

      // Fase 3: Segunda intersección verde
      await this.setIntersectionPhase(2, "green");
      await this.sleep(this.getGreenDuration());
      if (this.isFlaseo) return;

      await this.setIntersectionPhase(2, "yellow");
      await this.sleep(this.getYellowDuration());
      if (this.isFlaseo) return;

      // Fase de transición
      await this.setAllIntersections("red");
      await this.sleep(this.getRedDuration());
      if (this.isFlaseo) return;

      // Fase 4: Tercera intersección verde
      await this.setIntersectionPhase(3, "green");
      await this.sleep(this.getGreenDuration());
      if (this.isFlaseo) return;

      await this.setIntersectionPhase(3, "yellow");
      await this.sleep(this.getYellowDuration());
      if (this.isFlaseo) return;

      // Fase final: Todos rojos antes de reiniciar el ciclo
      await this.setAllIntersections("red");
      await this.sleep(this.getRedDuration());
    } catch (error) {
      this.logger.error("Error en ciclo de tráfico:", error);
      throw error;
    }
  }

  /**
   * Método mejorado para el modo flasheo
   */
  private async executeFlashCycle() {
    try {
      // Encender luces
      for (const [id, intersection] of this.intersections) {
        const color = id === 3 ? "red" : "yellow";
        TrafficLightVisualizer.drawTrafficLight(id, color, "F");
        if (color === "red") {
          await intersection.turnRed();
        } else {
          await intersection.turnYellow();
        }
      }
      await this.sleep(this.FLASH_INTERVAL);

      // Apagar luces
      for (const [id, intersection] of this.intersections) {
        TrafficLightVisualizer.drawTrafficLight(id, "off", "F");
        await intersection.stopTrafficLightCycle();
      }
      await this.sleep(this.FLASH_OFF_DURATION);
    } catch (error) {
      this.logger.error("Error en ciclo de flasheo:", error);
      throw error;
    }
  }

  /**
   * Método mejorado para el cruce peatonal
   */
  async startPedestrianCrossing() {
    this.logger.log("Iniciando secuencia de cruce peatonal");

    try {
      // Guardar el estado actual del ciclo
      const wasRunning = this.isInit;

      // Detener el ciclo actual
      await this.stopCycle();

      // Activar el cruce peatonal
      const mainIntersection = this.intersections.get(1);
      const pedestrianCrossing = this.pedestrianCrossings.get(1);

      if (!mainIntersection || !pedestrianCrossing) {
        throw new Error("Configuración de cruce peatonal no encontrada");
      }

      // Secuencia del cruce peatonal
      await this.setAllIntersections("red");
      await this.sleep(1000); // Tiempo de seguridad

      TrafficLightVisualizer.drawTrafficLight(1, "red", "P");
      await pedestrianCrossing.turnGreen();

      await this.sleep(this.PEDESTRIAN_CROSSING_DURATION);

      // Parpadeo de advertencia antes de cerrar el cruce
      for (let i = 0; i < 3; i++) {
        await pedestrianCrossing.stopTrafficLightCycle();
        await this.sleep(500);
        await pedestrianCrossing.turnGreen();
        await this.sleep(500);
      }

      await pedestrianCrossing.turnRed();

      // Reanudar el ciclo normal si estaba corriendo
      if (wasRunning) {
        await this.startTrafficLightCycle();
      }
    } catch (error) {
      this.logger.error("Error en secuencia de cruce peatonal:", error);
      // Intentar recuperar el sistema
      await this.startTrafficLightCycle();
    }
  }

  /**
   * Método para manejar cambios de modo
   */
  private async handleModeChange(newMode: TrafficMode) {
    if (this.currentMode === newMode) return;

    this.logModeChange(newMode);
    this.currentMode = newMode;

    // Detener el ciclo actual
    await this.stopAllTraffic();

    // Iniciar el nuevo modo
    switch (newMode) {
      case TrafficMode.FLASH:
        await this.flasheo();
        break;
      case TrafficMode.PEAK:
      case TrafficMode.NORMAL:
        await this.startTrafficLightCycle();
        break;
    }
  }
}

// import { HttpService } from "@nestjs/axios";
// import { HttpCode, Injectable, OnModuleInit } from "@nestjs/common";
// import { firstValueFrom } from "rxjs";
// import { Durations, Intersection } from "./intersection.class";
// import { TrafficLightVisualizer } from "./traffic-light-visualizer-log";

// @Injectable()
// export class AppService implements OnModuleInit {
//   isFlaseo = false;
//   isInit = false;
//   shouldContinueCycle: boolean = true;
//   intersection1: Intersection;
//   intersection2: Intersection;
//   intersection3: Intersection;
//   intersection4: Intersection;
//   peaton1: Intersection;

//   private normalTimings: { red: number; yellow: number; green: number };
//   private peakTimings: { red: number; yellow: number; green: number };

//   constructor() {
//     // Initialize with default values
//     this.normalTimings = { red: 1, yellow: 3, green: 30 }; // Normal schedul 35 seconds
//     this.peakTimings = { red: 1, yellow: 3, green: 30 }; // Peak schedul 45 seconds
//   }

//   onModuleInit() {
//     console.log("Inicializando intersecciones...");
//     const initialTimings = this.getInitialTimings();

//     this.intersection1 = new Intersection(17, 27, 22, initialTimings);
//     this.intersection2 = new Intersection(6, 13, 19, initialTimings);
//     this.intersection3 = new Intersection(12, 16, 20, initialTimings);
//     //  this.intersection4 = new Intersection(24, 25, 26, { red: 1000, yellow: 2000, green: 3000 });

//     this.peaton1 = new Intersection(21, 0, 26, {
//       red: 1,
//       yellow: 0,
//       green: 10,
//     });
//   }

//   updateNormalTimings(
//     greenDuration: number,
//     yellowDuration: number,
//     redDuration: number
//   ) {
//     this.normalTimings = {
//       red: redDuration,
//       yellow: yellowDuration,
//       green: greenDuration,
//     };
//   }

//   updatePeakTimings(
//     greenDuration: number,
//     yellowDuration: number,
//     redDuration: number
//   ) {
//     this.peakTimings = {
//       red: redDuration,
//       yellow: yellowDuration,
//       green: greenDuration,
//     };
//   }

//   getNormalTimings() {
//     return this.normalTimings;
//   }

//   getPeakTimings() {
//     return this.peakTimings;
//   }

//   getIntersectionsStatus() {
//     const statusObject = {
//       intersection1: this.intersection1.getStatus(),
//       intersection2: this.intersection2.getStatus(),
//       intersection3: this.intersection3.getStatus(),
//     };

//     // Convertir el objeto a un array
//     return Object.values(statusObject);
//   }

//   private getInitialTimings(): { red: number; yellow: number; green: number } {
//     const now = new Date();
//     const day = now.getDay();
//     const hour = now.getHours();
//     const minute = now.getMinutes();

//     // Fin de semana (sábado y domingo)
//     if (day === 0 || day === 6) {
//       console.log("getInitialTimings ---> Horario normal todo el día");
//       return this.normalTimings; // Horario normal todo el día
//     }

//     // Días de semana (lunes a viernes)
//     if (
//       (hour === 6 && minute >= 30) ||
//       hour === 7 ||
//       (hour === 8 && minute <= 30) ||
//       (hour === 11 && minute >= 30) ||
//       hour === 12 ||
//       (hour === 13 && minute <= 30) ||
//       (hour === 16 && minute >= 30) ||
//       hour === 17 ||
//       hour === 18 ||
//       (hour === 19 && minute <= 30)
//     ) {
//       console.log("getInitialTimings ---> Hora pico");
//       return this.peakTimings; // Hora pico
//     } else if (hour >= 22 || hour < 5) {
//       console.log("getInitialTimings ---> Modo flasheo");
//       return { red: 1, yellow: 1, green: 1 }; // Modo flasheo (los tiempos exactos se manejan en la función flasheo)
//     } else {
//       console.log("getInitialTimings ---> Horario normal");
//       return this.normalTimings; // Horario normal
//     }
//   }

//   updateIntersectionTimings(
//     greenDuration: number,
//     yellowDuration: number,
//     redDuration: number
//   ) {
//     const newDurations = {
//       red: redDuration,
//       yellow: yellowDuration,
//       green: greenDuration,
//     };
//     this.intersection1.updateDurations(newDurations);
//     this.intersection2.updateDurations(newDurations);
//     this.intersection3.updateDurations(newDurations);
//     // this.intersection4.updateDurations(newDurations);
//     // Nota: No actualizamos los tiempos del semáforo peatonal (peaton1) aquí
//   }

//   async startTrafficLightCycle(isInit = true) {

//     this.isInit = isInit;
//     this.shouldContinueCycle = true;
//     this.isFlaseo = false;
//     await this.stopTraffic(true, false);

//     try {
//       while (this.isInit) {
//         if (this.isFlaseo) break;

//         // Fase inicial - todos rojos
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "1");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "1");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "1");

//         this.intersection1.turnRed();
//         this.intersection2.turnRed();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection1.getRedDuration);

//         if (this.isFlaseo) break;

//         // Fase 1 - Verde para intersección 1
//         TrafficLightVisualizer.drawTrafficLight(1, "green", "2");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "2");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "2");

//         this.intersection1.turnGreen();
//         this.intersection2.turnRed();
//         await this.sleep(this.intersection1.getGreenDuration);

//         if (this.isFlaseo) break;

//         // Fase 1 - Amarillo para intersección 1
//         TrafficLightVisualizer.drawTrafficLight(1, "yellow", "3");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "3");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "3");

//         this.intersection1.turnYellow();
//         this.intersection2.turnRed();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection1.getYellowDuration);

//         if (this.isFlaseo) break;

//         // Todos rojos
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "4");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "4");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "4");

//         this.intersection1.turnRed();
//         this.intersection2.turnRed();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection2.getRedDuration);

//         if (this.isFlaseo) break;

//         // Fase 2 - Verde para intersección 2
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "5");
//         TrafficLightVisualizer.drawTrafficLight(2, "green", "5");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "5");

//         this.intersection1.turnRed();
//         this.intersection2.turnGreen();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection2.getGreenDuration);

//         if (this.isFlaseo) break;

//         // Fase 2 - Amarillo para intersección 2
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "6");
//         TrafficLightVisualizer.drawTrafficLight(2, "yellow", "6");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "6");

//         this.intersection1.turnRed();
//         this.intersection2.turnYellow();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection2.getYellowDuration);

//         if (this.isFlaseo) break;

//         // Todos rojos
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "7");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "7");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "7");

//         this.intersection1.turnRed();
//         this.intersection2.turnRed();
//         this.intersection3.turnRed();
//         await this.sleep(this.intersection2.getRedDuration);

//         if (this.isFlaseo) break;

//         // Fase 3 - Verde para intersección 3
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "8");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "8");
//         TrafficLightVisualizer.drawTrafficLight(3, "green", "8");

//         this.intersection1.turnRed();
//         this.intersection2.turnRed();
//         this.intersection3.turnGreen();
//         await this.sleep(this.intersection3.getGreenDuration);

//         if (this.isFlaseo) break;

//         // Fase 3 - Amarillo para intersección 3
//         TrafficLightVisualizer.drawTrafficLight(1, "red", "9");
//         TrafficLightVisualizer.drawTrafficLight(2, "red", "9");
//         TrafficLightVisualizer.drawTrafficLight(3, "yellow", "9");

//         this.intersection1.turnRed();
//         this.intersection2.turnRed();
//         this.intersection3.turnYellow();
//         await this.sleep(this.intersection3.getYellowDuration);
//       }

//       if (!this.isFlaseo) {
//         await this.stopTraffic(false, false);
//       }
//       console.log("Salir del ciclo de semáforos");
//     } catch (error) {
//       await this.stopTraffic(false, false);
//       console.log("Error en el ciclo de semáforos:", error);
//     }
//   }

//   private sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   // Método para detener el ciclo infinito en una intersección específica
//   async stopTraffic(init = false, flash = false): Promise<any> {
//     this.isInit = init;
//     this.isFlaseo = flash;
//     this.shouldContinueCycle = init;
//     try {
//       console.log("detener semáforo", this.isFlaseo);
//       return await Promise.all([
//         await this.intersection1.stopTrafficLightCycle(),
//         await this.intersection2.stopTrafficLightCycle(),
//         await this.intersection3.stopTrafficLightCycle(),
//         // await this.intersection4.stopTrafficLightCycle(),
//         await this.peaton1.stopTrafficLightCycle(),
//       ]);
//     } catch (e) {
//       console.log(e, "error");
//     }
//   }

//   async stopCycle() {
//     await this.stopTraffic();
//     this.shouldContinueCycle = false;
//   }

//   async startPeaton() {
//     console.log("iniciar peaton");

//     this.intersection1.stopTrafficLightCycle();
//     this.intersection2.stopTrafficLightCycle();

//     this.intersection1.turnGreen(); // inteserection => rojo
//     this.intersection2.turnRed();
//     // this.intersection3.turnRed();
//     // this.intersection4.turnRed();
//     this.peaton1.turnGreen(); // peaton => verde
//     await this.sleep(15000);
//     // this.stopTraffic()
//     await this.intersection1.stopTrafficLightCycle();
//     await this.intersection2.stopTrafficLightCycle();
//     await this.peaton1.stopTrafficLightCycle();
//     await this.startTrafficLightCycle();
//   }

//   async flasheo(isFlaseo = true) {
//     await this.stopTraffic(false, true);
//     this.isFlaseo = isFlaseo;
//     console.log("Iniciando flasheo", this.isFlaseo);

//     if (!this.isFlaseo) {
//       console.log("apagar flasheo", this.isFlaseo);
//       await this.stopTraffic(false, isFlaseo);
//       return;
//     }

//     while (this.isFlaseo) {
//       try {
//         TrafficLightVisualizer.drawTrafficLight(1, "yellow", "F");
//         TrafficLightVisualizer.drawTrafficLight(2, "yellow", "F");
//         TrafficLightVisualizer.drawTrafficLight(3, "red", "F");

//         await this.intersection1.turnYellow();
//         await this.intersection2.turnYellow();
//         await this.intersection3.turnRed();
//         await this.sleep(1000);

//         TrafficLightVisualizer.drawTrafficLight(1, "off", "F");
//         TrafficLightVisualizer.drawTrafficLight(2, "off", "F");
//         TrafficLightVisualizer.drawTrafficLight(3, "off", "F");

//         await this.intersection1.stopTrafficLightCycle();
//         await this.intersection2.stopTrafficLightCycle();
//         await this.intersection3.stopTrafficLightCycle();
//         await this.sleep(5000);
//       } catch (e) {
//         console.log(e, "error");
//       }
//     }
//     await this.stopTraffic(false, false);
//   }
// }
