"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intersection = void 0;
const onoff_1 = require("onoff");
const mock_gpio_1 = require("./mock-gpio");
const GpioClass = process.env.NODE_ENV === "production" ? onoff_1.Gpio : mock_gpio_1.MockGpio;
const tipo = process.env.NODE_ENV === "production" ? "Gpio" : "MockGpio";
console.log("GPIO class", tipo);
class Intersection {
    constructor(redPin, yellowPin, greenPin, durations) {
        this.redLed = new GpioClass(redPin, "out");
        this.yellowLed = new GpioClass(yellowPin, "out");
        this.greenLed = new GpioClass(greenPin, "out");
        this.redDuration = durations.red;
        this.greenDuration = durations.green;
        this.yellowDuration = durations.yellow;
    }
    updateDurations(durations) {
        this.redDuration = durations.red;
        this.yellowDuration = durations.yellow;
        this.greenDuration = durations.green;
    }
    get getRedDuration() {
        return this.redDuration * 1000;
    }
    get getGreenDuration() {
        return this.greenDuration * 1000;
    }
    get getYellowDuration() {
        return this.yellowDuration * 1000;
    }
    async turnRed() {
        this.redLed.writeSync(1);
        this.yellowLed.writeSync(0);
        this.greenLed.writeSync(0);
    }
    async turnYellow() {
        this.redLed.writeSync(0);
        this.yellowLed.writeSync(1);
        this.greenLed.writeSync(0);
    }
    async turnGreen() {
        this.redLed.writeSync(0);
        this.yellowLed.writeSync(0);
        this.greenLed.writeSync(1);
    }
    async stopTrafficLightCycle() {
        this.redLed.writeSync(0);
        this.yellowLed.writeSync(0);
        this.greenLed.writeSync(0);
    }
    async startPeaton() {
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
exports.Intersection = Intersection;
//# sourceMappingURL=intersection.class.js.map