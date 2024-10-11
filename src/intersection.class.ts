import { Gpio } from 'onoff';

export interface Durations {
  red: number;
  yellow: number;
  green: number;
}

export class Intersection {
  private redLed: Gpio;
  private yellowLed: Gpio;
  private greenLed: Gpio;
  private redDuration: number;
  private greenDuration: number;
  private yellowDuration: number;


  
  constructor(redPin: number, yellowPin: number, greenPin: number, durations: Durations) {
    this.redLed = new Gpio(redPin, 'out');
    this.yellowLed = new Gpio(yellowPin, 'out');
    this.greenLed = new Gpio(greenPin, 'out');

    this.redDuration = durations.red;
    this.greenDuration = durations.green;
    this.yellowDuration = durations.yellow;
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






}
