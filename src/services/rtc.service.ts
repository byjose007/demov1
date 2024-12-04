import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import * as i2c from 'i2c-bus';

@Injectable()
export class RtcService implements OnApplicationShutdown {
  private readonly logger = new Logger(RtcService.name);
  private i2c1: any;
  private isSimulated: boolean = false;
  
  // Dirección I2C del DS3231
  private readonly DS3231_ADDR = 0x68;
  // Registro inicial para leer/escribir la hora
  private readonly SECOND_REG = 0x00;

  constructor() {
    this.initializeI2C();
  }

  private initializeI2C() {
    try {
      // Verificar si estamos en desarrollo
      if (process.env.NODE_ENV !== 'production') {
        this.isSimulated = true;
        this.logger.log('Running in development mode - using system time');
        return;
      }

      // Intentar inicializar I2C
      this.i2c1 = i2c.openSync(1);
      this.logger.log('RTC module initialized successfully');
    } catch (error) {
      this.isSimulated = true;
      this.logger.warn(`Error initializing RTC: ${error.message}. Using system time.`);
    }
  }

  public getCurrentTime(): Date {
    if (this.isSimulated) {
      return new Date();
    }

    try {
      const buffer = Buffer.alloc(7);
      this.i2c1.readI2cBlockSync(this.DS3231_ADDR, this.SECOND_REG, 7, buffer);

      const second = this.bcd2dec(buffer[0] & 0x7F);
      const minute = this.bcd2dec(buffer[1]);
      const hour = this.bcd2dec(buffer[2] & 0x3F);
      const day = this.bcd2dec(buffer[4]);
      const month = this.bcd2dec(buffer[5] & 0x1F);
      const year = this.bcd2dec(buffer[6]) + 2000;

      return new Date(year, month - 1, day, hour, minute, second);
    } catch (error) {
      this.logger.warn(`Error reading time: ${error.message}. Using system time.`);
      return new Date();
    }
  }

  public setTime(date: Date): void {
    if (this.isSimulated) {
      this.logger.log('Skipping setTime in development mode');
      return;
    }

    try {
      const buffer = Buffer.alloc(7);
      
      buffer[0] = this.dec2bcd(date.getSeconds());
      buffer[1] = this.dec2bcd(date.getMinutes());
      buffer[2] = this.dec2bcd(date.getHours());
      buffer[3] = this.dec2bcd(date.getDay() + 1);
      buffer[4] = this.dec2bcd(date.getDate());
      buffer[5] = this.dec2bcd(date.getMonth() + 1);
      buffer[6] = this.dec2bcd(date.getFullYear() - 2000);

      this.i2c1.writeI2cBlockSync(this.DS3231_ADDR, this.SECOND_REG, 7, buffer);
      this.logger.log('Time set successfully');
    } catch (error) {
      this.logger.error(`Error setting time: ${error.message}`);
    }
  }

  private dec2bcd(val: number): number {
    return ((val / 10) << 4) | (val % 10);
  }

  private bcd2dec(val: number): number {
    return ((val >> 4) * 10) + (val & 0x0f);
  }

  onApplicationShutdown() {
    if (this.i2c1 && !this.isSimulated) {
      try {
        this.i2c1.closeSync();
        this.logger.log('RTC connection closed');
      } catch (error) {
        this.logger.error(`Error closing RTC connection: ${error.message}`);
      }
    }
  }

  public getSystemInfo(): Record<string, any> {
    return {
      isSimulated: this.isSimulated,
      currentTime: this.getCurrentTime(),
      timeString: this.getCurrentTime().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    };
  }
}