// rtc.service.ts
import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { MockI2C } from '../shared/mock-rtc.service';

@Injectable()
export class RtcService implements OnApplicationShutdown {
  private readonly logger = new Logger(RtcService.name);
  private i2c1: any;
  private readonly DS3231_ADDR = 0x68;
  private readonly SECOND_REG = 0x00;
  private isWindows: boolean;

  constructor() {
    this.isWindows = process.platform === 'win32';
    this.initializeI2C();
  }

  private initializeI2C(): void {
    try {
      if (this.isWindows) {
        this.logger.log('Running on Windows - using mock I2C implementation');
        this.i2c1 = MockI2C.getInstance();
      } else {
        const i2c = require('i2c-bus');
        this.i2c1 = i2c.openSync(1);
      }
    } catch (error) {
      this.logger.warn(`Failed to initialize I2C: ${error.message}`);
      this.i2c1 = MockI2C.getInstance();
    }
  }

  private dec2bcd(val: number): number {
    return ((val / 10) << 4) | (val % 10);
  }

  private bcd2dec(val: number): number {
    return ((val >> 4) * 10) + (val & 0x0f);
  }

  public getCurrentTime(): Date {
    try {
      const buffer = Buffer.alloc(7);
      this.i2c1.readI2cBlockSync(this.DS3231_ADDR, this.SECOND_REG, 7, buffer);

      if (this.isWindows) {
        console.log('Mock time on Windows environment', new Date());
        
        return new Date(); // Return system time on Windows
      }

      const second = this.bcd2dec(buffer[0] & 0x7F);
      const minute = this.bcd2dec(buffer[1]);
      const hour = this.bcd2dec(buffer[2] & 0x3F);
      const day = this.bcd2dec(buffer[4]);
      const month = this.bcd2dec(buffer[5] & 0x1F);
      const year = this.bcd2dec(buffer[6]) + 2000;
      console.log(`Current RTC time: ${year}-${month}-${day} ${hour}:${minute}:${second}`);
      return new Date(year, month - 1, day, hour, minute, second);
    } catch (error) {
      this.logger.warn(`Error reading time: ${error.message}. Using system time.`);
      return new Date();
    }
  }

  public setTime(date: Date): boolean {
    if (this.isWindows) {
      this.logger.log('Mock time set on Windows environment');
      return true;
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
      return true;
    } catch (error) {
      this.logger.error(`Failed to set time: ${error.message}`);
      return false;
    }
  }

  public getTemperature(): number {
    if (this.isWindows) {
      return 25.0; // Mock temperature for Windows
    }

    try {
      const msb = this.i2c1.readByteSync(this.DS3231_ADDR, 0x11);
      const lsb = this.i2c1.readByteSync(this.DS3231_ADDR, 0x12);
      return msb + ((lsb >> 6) * 0.25);
    } catch (error) {
      this.logger.error(`Failed to read temperature: ${error.message}`);
      return 25.0; // Default temperature
    }
  }

  public getRTCInfo(): Record<string, any> {
    const currentTime = this.getCurrentTime();
    return {
      currentTime,
      timeSource: this.isWindows ? 'Windows System Clock' : 'RTC Module',
      temperature: this.getTemperature(),
      timeString: currentTime.toLocaleString('es-EC', { timeZone: 'America/Guayaquil' }),
      isRTCAvailable: !this.isWindows,
      environment: this.isWindows ? 'Windows Development' : 'Production'
    };
  }

  onApplicationShutdown() {
    if (!this.isWindows && this.i2c1) {
      try {
        this.i2c1.closeSync();
      } catch (error) {
        this.logger.error(`Error closing I2C connection: ${error.message}`);
      }
    }
  }
}