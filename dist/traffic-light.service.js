"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TrafficLightService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLightService = void 0;
const common_1 = require("@nestjs/common");
const onoff_1 = require("onoff");
let TrafficLightService = TrafficLightService_1 = class TrafficLightService {
    constructor(redPin, yellowPin, greenPin, durations) {
        this.redLed = new onoff_1.Gpio(redPin, 'out');
        this.yellowLed = new onoff_1.Gpio(yellowPin, 'out');
        this.greenLed = new onoff_1.Gpio(greenPin, 'out');
        this.redDuration = durations.red;
        this.greenDuration = durations.green;
        this.yellowDuration = durations.yellow;
    }
    turnRed() {
        this.redLed.writeSync(1);
        this.yellowLed.writeSync(0);
        this.greenLed.writeSync(0);
    }
    turnYellow() {
        this.redLed.writeSync(0);
        this.yellowLed.writeSync(1);
        this.greenLed.writeSync(0);
    }
    turnGreen() {
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
        this.startTrafficLightCycle();
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    createIntersection(redPin, yellowPin, greenPin, durations) {
        return new TrafficLightService_1(redPin, yellowPin, greenPin, durations);
    }
    stopTrafficLightCycle() {
        this.redLed.writeSync(0);
        this.yellowLed.writeSync(0);
        this.greenLed.writeSync(0);
    }
};
TrafficLightService = TrafficLightService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number, Number, Number, Object])
], TrafficLightService);
exports.TrafficLightService = TrafficLightService;
//# sourceMappingURL=traffic-light.service.js.map