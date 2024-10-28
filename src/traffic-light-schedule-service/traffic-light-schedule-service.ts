/**
 * @fileoverview Servicio para gestionar los horarios programados del sistema de semáforos
 * Este servicio maneja la programación automática de los diferentes modos de operación
 * del sistema de semáforos basándose en las horas del día y los días de la semana.
 * 
 * @requires nestjs/common
 * @requires nestjs/schedule
 * @requires ../app.service
 * @requires ../enums/traffic-mode.enum
 */

import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AppService } from "../app.service";
import { TrafficMode } from "../enums/traffic-mode.enum";

/**
 * Servicio para la programación automática del sistema de semáforos
 * Gestiona los cambios automáticos entre modos de operación según horarios predefinidos
 * 
 * @class TrafficLightScheduleService
 * @injectable
 */
@Injectable()
export class TrafficLightScheduleService {
  private readonly logger = new Logger(TrafficLightScheduleService.name);

  constructor(private readonly appService: AppService) {}

  /**
   * Inicia el horario normal en días de semana a las 5:00 AM
   * @cron "0 5 * * 1-5" - Se ejecuta a las 5:00 AM de lunes a viernes
   */
  @Cron("0 5 * * 1-5")
  async startWeekdayNormalHours() {
    if (this.isWeekday()) {
      this.logger.log("Iniciando horario normal en día de semana - 5:00 AM");
      await this.setScheduleMode(TrafficMode.NORMAL);
    }
  }

  /**
   * Inicia el horario pico matutino en días de semana a las 6:30 AM
   * @cron "30 6 * * 1-5" - Se ejecuta a las 6:30 AM de lunes a viernes
   */
  @Cron("30 6 * * 1-5")
  async startWeekdayPeakHours1() {
    if (this.isWeekday()) {
      this.logger.log("Iniciando hora pico en día de semana - 6:30 AM");
      await this.setScheduleMode(TrafficMode.PEAK);
    }
  }

  /**
   * Regresa al horario normal después del pico matutino a las 8:31 AM
   * @cron "31 8 * * 1-5" - Se ejecuta a las 8:31 AM de lunes a viernes
   */
  @Cron("31 8 * * 1-5")
  async startWeekdayNormalHours2() {
    if (this.isWeekday()) {
      this.logger.log("Volviendo a horario normal en día de semana - 8:31 AM");
      await this.setScheduleMode(TrafficMode.NORMAL);
    }
  }

  /**
   * Inicia el horario pico del mediodía a las 11:30 AM
   * @cron "30 11 * * 1-5" - Se ejecuta a las 11:30 AM de lunes a viernes
   */
  @Cron("30 11 * * 1-5")
  async startWeekdayPeakHours2() {
    if (this.isWeekday()) {
      this.logger.log("Iniciando hora pico en día de semana - 11:30 AM");
      await this.setScheduleMode(TrafficMode.PEAK);
    }
  }

  /**
   * Regresa al horario normal después del pico del mediodía a la 1:31 PM
   * @cron "31 13 * * 1-5" - Se ejecuta a la 1:31 PM de lunes a viernes
   */
  @Cron("31 13 * * 1-5")
  async startWeekdayNormalHours3() {
    if (this.isWeekday()) {
      this.logger.log("Volviendo a horario normal en día de semana - 13:31 PM");
      await this.setScheduleMode(TrafficMode.NORMAL);
    }
  }

  /**
   * Inicia el horario pico vespertino a las 4:30 PM
   * @cron "30 16 * * 1-5" - Se ejecuta a las 4:30 PM de lunes a viernes
   */
  @Cron("30 16 * * 1-5")
  async startWeekdayPeakHours3() {
    if (this.isWeekday()) {
      this.logger.log("Iniciando hora pico en día de semana - 16:30 PM");
      await this.setScheduleMode(TrafficMode.PEAK);
    }
  }

  /**
   * Regresa al horario normal después del pico vespertino a las 7:31 PM
   * @cron "31 19 * * 1-5" - Se ejecuta a las 7:31 PM de lunes a viernes
   */
  @Cron("31 19 * * 1-5")
  async startWeekdayNormalHours4() {
    if (this.isWeekday()) {
      this.logger.log("Volviendo a horario normal en día de semana - 19:31 PM");
      await this.setScheduleMode(TrafficMode.NORMAL);
    }
  }

  /**
   * Inicia el modo flasheo nocturno en días de semana a las 10:00 PM
   * @cron "0 22 * * 1-5" - Se ejecuta a las 10:00 PM de lunes a viernes
   */
  @Cron("0 22 * * 1-5")
  async startWeekdayFlashMode() {
    if (this.isWeekday()) {
      this.logger.log("Iniciando modo flasheo en día de semana - 22:00 PM");
      await this.setScheduleMode(TrafficMode.FLASH);
    }
  }

  /**
   * Inicia el horario normal en fines de semana a las 5:00 AM
   * @cron "0 5 * * 0,6" - Se ejecuta a las 5:00 AM los sábados y domingos
   */
  @Cron("0 5 * * 0,6")
  async startWeekendNormalHours() {
    if (!this.isWeekday()) {
      this.logger.log("Iniciando horario normal en fin de semana - 5:00 AM");
      await this.setScheduleMode(TrafficMode.NORMAL);
    }
  }

  /**
   * Inicia el modo flasheo nocturno en fines de semana a las 10:00 PM
   * @cron "0 22 * * 0,6" - Se ejecuta a las 10:00 PM los sábados y domingos
   */
  @Cron("0 22 * * 0,6")
  async startWeekendFlashMode() {
    if (!this.isWeekday()) {
      this.logger.log("Iniciando modo flasheo en fin de semana - 22:00 PM");
      await this.setScheduleMode(TrafficMode.FLASH);
    }
  }

  /**
   * Establece el modo de operación del sistema de semáforos
   * @param mode - Modo de operación a establecer (NORMAL, PEAK, FLASH)
   * @private
   * 
   * @throws {Error} Si hay un error al cambiar el modo de operación
   */
  private async setScheduleMode(mode: TrafficMode) {
    try {
      switch (mode) {
        case TrafficMode.FLASH:
          await this.appService.flasheo(true);
          break;
        case TrafficMode.PEAK:
        case TrafficMode.NORMAL:
          // Detener el ciclo actual antes de iniciar uno nuevo
          await this.appService.stopCycle();
          // Iniciar nuevo ciclo con los tiempos correspondientes al modo
          await this.appService.startTrafficLightCycle(true);
          break;
      }
      this.logger.log(`Modo de tráfico cambiado exitosamente a: ${mode}`);
    } catch (error) {
      this.logger.error(`Error al cambiar al modo ${mode}:`, error);
      // Intento de recuperación del sistema
      await this.appService.startTrafficLightCycle(true);
    }
  }

  /**
   * Verifica si el día actual es un día de semana (lunes a viernes)
   * @returns {boolean} true si es día de semana, false si es fin de semana
   * @private
   */
  private isWeekday(): boolean {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  }
}