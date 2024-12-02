import { EventEmitter } from 'events';
import { Gpio } from 'onoff';
import { MockGpio } from './shared/mock-gpio';
import { TimingConfig } from './interfaces/trafic-state.interface';


const GpioClass = process.env.NODE_ENV === 'production' ? Gpio : MockGpio;

export class Intersection extends EventEmitter {
  private redLed: Gpio | MockGpio;
  private yellowLed: Gpio | MockGpio;
  private greenLed: Gpio | MockGpio;
  private redDuration: number;
  private greenDuration: number;
  private yellowDuration: number;
  private intersectionId: number;

  constructor(
    intersectionId: number,
    redPin: number,
    yellowPin: number,
    greenPin: number,
    durations: TimingConfig
  ) {
    super();
    this.intersectionId = intersectionId;
    this.redLed = new GpioClass(redPin, 'out');
    this.yellowLed = new GpioClass(yellowPin, 'out');
    this.greenLed = new GpioClass(greenPin, 'out');

    this.updateDurations(durations);
  }

  updateDurations(durations: TimingConfig) {
    this.redDuration = durations.red;
    this.yellowDuration = durations.yellow;
    this.greenDuration = durations.green;
    this.emit('durationsUpdated', { intersectionId: this.intersectionId, durations });
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

  async turnRed(): Promise<void> {
    await this.redLed.writeSync(1);
    await this.yellowLed.writeSync(0);
    await this.greenLed.writeSync(0);
    this.emit('stateChanged', { intersectionId: this.intersectionId, state: 'red' });
  }

  async turnYellow(): Promise<void> {
    await this.redLed.writeSync(0);
    await this.yellowLed.writeSync(1);
    await this.greenLed.writeSync(0);
    this.emit('stateChanged', { intersectionId: this.intersectionId, state: 'yellow' });
  }

  async turnGreen(): Promise<void> {
    await this.redLed.writeSync(0);
    await this.yellowLed.writeSync(0);
    await this.greenLed.writeSync(1);
    this.emit('stateChanged', { intersectionId: this.intersectionId, state: 'green' });
  }

  async stopTrafficLightCycle(): Promise<void> {
    await this.redLed.writeSync(0);
    await this.yellowLed.writeSync(0);
    await this.greenLed.writeSync(0);
    this.emit('stateChanged', { intersectionId: this.intersectionId, state: 'off' });
  }

  getStatus() {
    return {
      id: this.intersectionId,
      status: {
        red: this.redLed.readSync() === 1,
        yellow: this.yellowLed.readSync() === 1,
        green: this.greenLed.readSync() === 1,
      },
      lastUpdate: new Date()
    };
  }

  async cleanup(): Promise<void> {
    await this.stopTrafficLightCycle();
    this.redLed.unexport();
    this.yellowLed.unexport();
    this.greenLed.unexport();
  }
}


// import { Gpio } from "onoff";
// import { MockGpio } from "./shared/mock-gpio";

// const GpioClass = process.env.NODE_ENV === "production" ? Gpio : MockGpio;
// const tipo = process.env.NODE_ENV === "production" ? "Gpio" : "MockGpio";

// console.log("GPIO class", tipo);

// export interface Durations {
//   red: number;
//   yellow: number;
//   green: number;
// }

// export class Intersection {
//   private redLed: Gpio | MockGpio;
//   private yellowLed: Gpio | MockGpio;
//   private greenLed: Gpio | MockGpio;
//   private redDuration: number;
//   private greenDuration: number;
//   private yellowDuration: number;

//   constructor(
//     redPin: number,
//     yellowPin: number,
//     greenPin: number,
//     durations: Durations
//   ) {
//     this.redLed = new GpioClass(redPin, "out");
//     this.yellowLed = new GpioClass(yellowPin, "out");
//     this.greenLed = new GpioClass(greenPin, "out");

//     this.redDuration = durations.red;
//     this.greenDuration = durations.green;
//     this.yellowDuration = durations.yellow;
//   }

//   updateDurations(durations: Durations) {
//     this.redDuration = durations.red;
//     this.yellowDuration = durations.yellow;
//     this.greenDuration = durations.green;
//   }

//   get getRedDuration(): number {
//     return this.redDuration * 1000;
//   }

//   get getGreenDuration(): number {
//     return this.greenDuration * 1000;
//   }

//   get getYellowDuration(): number {
//     return this.yellowDuration * 1000;
//   }

//   async turnRed(): Promise<any> {
//     this.redLed.writeSync(1);
//     this.yellowLed.writeSync(0);
//     this.greenLed.writeSync(0);
//   }

//   async turnYellow(): Promise<any> {
//     this.redLed.writeSync(0);
//     this.yellowLed.writeSync(1);
//     this.greenLed.writeSync(0);
//   }

//   async turnGreen(): Promise<any> {
//     this.redLed.writeSync(0);
//     this.yellowLed.writeSync(0);
//     this.greenLed.writeSync(1);
//   }

//   async stopTrafficLightCycle(): Promise<any> {
//     this.redLed.writeSync(0);
//     this.yellowLed.writeSync(0);
//     this.greenLed.writeSync(0);
//   }

//   async startPeaton(): Promise<any> {
//     this.redLed.writeSync(0);
//     this.yellowLed.writeSync(0);
//     this.greenLed.writeSync(1);
//   }

//   getStatus() {
//     return {
//       red: this.redLed.readSync() === 1,
//       yellow: this.yellowLed.readSync() === 1,
//       green: this.greenLed.readSync() === 1,
//     };
//   }
// }
