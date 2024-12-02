import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Gpio } from "onoff";
import { Intersection } from "../intersection.class";
import { MockGpio } from "../shared/mock-gpio";

const GpioClass = process.env.NODE_ENV === "production" ? Gpio : MockGpio;

@Injectable()
export class ButtonService implements OnModuleInit, OnModuleDestroy {
  private button: Gpio | MockGpio;
  private redLed: Gpio | MockGpio;
  private readonly buttonPin = 5; // Cambia el número del pin según tu conexión

  onModuleInit() {
    this.redLed = new GpioClass(21, "out");
    this.button = new GpioClass(this.buttonPin, "in", "both", {
      debounceTimeout: 10,
    });
    console.log("Esperando a que se presione el botón...");
    this.button.watch((err, value) => console.log(value, "value"));
    // this.button.watch((err, value) => this.handleButtonPress(err, value));
  }

  private handleButtonPress(err, value) {
    console.log(value, "value");
    if (err) {
      console.log(err, "err");
      throw err;
    }

    if (value === 1) {
      console.log("Botón presionado");
      // Realiza aquí las acciones que desees realizar cuando el botón sea presionado
    }
  }

  onModuleDestroy() {
    this.button.unwatchAll();
    this.button.unexport();
    console.log("Aplicación terminada, recursos liberados.");
  }
}
