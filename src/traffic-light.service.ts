import { Injectable } from '@nestjs/common';
import { Gpio } from 'onoff';

@Injectable()
export class TrafficLightService {
  private redLed: Gpio;
  private yellowLed: Gpio;
  private greenLed: Gpio;
  private redDuration: number;
  private greenDuration: number;
  private yellowDuration: number;


  constructor(redPin: number, yellowPin: number, greenPin: number, durations: any) {
    this.redLed = new Gpio(redPin, 'out');
    this.yellowLed = new Gpio(yellowPin, 'out');
    this.greenLed = new Gpio(greenPin, 'out');

    this.redDuration = durations.red;
    this.greenDuration = durations.green;
    this.yellowDuration = durations.yellow;
  }

  private turnRed() {
    this.redLed.writeSync(1);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(0);
  }

  private turnYellow() {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(1);
    this.greenLed.writeSync(0);
  }

  private turnGreen() {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(1);
  }

  async startTrafficLightCycle() {
    this.turnRed();
    await this.sleep(this.redDuration);

    this.turnGreen();
    await this.sleep(this.greenDuration);

    this.turnYellow();
    await this.sleep(this.yellowDuration);

    this.startTrafficLightCycle(); // Repetir el ciclo
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  // Método para crear instancias de TrafficLight con diferentes configuraciones
  createIntersection(redPin: number, yellowPin: number, greenPin: number, durations: any) {
    return new TrafficLightService(redPin, yellowPin, greenPin, durations);
  }

  stopTrafficLightCycle() {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(0);
  }



}
