import { Gpio } from "onoff";
import { MockGpio } from "./mock-gpio";

const GpioClass = process.env.NODE_ENV === "production" ? Gpio : MockGpio;
const tipo = process.env.NODE_ENV === "production" ? "Gpio" : "MockGpio";

console.log("GPIO class", tipo);

export interface Durations {
  red: number;
  yellow: number;
  green: number;
}

export class Intersection {
  private redLed: Gpio | MockGpio;
  private yellowLed: Gpio | MockGpio;
  private greenLed: Gpio | MockGpio;
  private redDuration: number;
  private greenDuration: number;
  private yellowDuration: number;

  constructor(
    redPin: number,
    yellowPin: number,
    greenPin: number,
    durations: Durations
  ) {
    this.redLed = new GpioClass(redPin, "out");
    this.yellowLed = new GpioClass(yellowPin, "out");
    this.greenLed = new GpioClass(greenPin, "out");

    this.redDuration = durations.red;
    this.greenDuration = durations.green;
    this.yellowDuration = durations.yellow;
  }

  updateDurations(durations: Durations) {
    this.redDuration = durations.red;
    this.yellowDuration = durations.yellow;
    this.greenDuration = durations.green;
  }

  get getRedDuration(): number {
    return this.redDuration * 1000;
  }

  get getGreenDuration(): number {
    return this.greenDuration * 1000;
  }

  get getYellowDuration(): number {
    return this.yellowDuration * 1000;
  }

  async turnRed(): Promise<any> {
    this.redLed.writeSync(1);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(0);
  }

  async turnYellow(): Promise<any> {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(1);
    this.greenLed.writeSync(0);
  }

  async turnGreen(): Promise<any> {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(1);
  }

  async stopTrafficLightCycle(): Promise<any> {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(0);
  }

  async startPeaton(): Promise<any> {
    this.redLed.writeSync(0);
    this.yellowLed.writeSync(0);
    this.greenLed.writeSync(1);
  }

  getStatus() {
    return {
      red: this.redLed.readSync() === 1,
      yellow: this.yellowLed.readSync() === 1,
      green: this.greenLed.readSync() === 1,
    };
  }
}
