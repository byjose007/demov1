"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonService = void 0;
const common_1 = require("@nestjs/common");
const onoff_1 = require("onoff");
const mock_gpio_1 = require("./mock-gpio");
const GpioClass = process.env.NODE_ENV === "production" ? onoff_1.Gpio : mock_gpio_1.MockGpio;
let ButtonService = class ButtonService {
    constructor() {
        this.buttonPin = 5;
    }
    onModuleInit() {
        this.redLed = new GpioClass(21, "out");
        this.button = new GpioClass(this.buttonPin, "in", "both", {
            debounceTimeout: 10,
        });
        console.log("Esperando a que se presione el botón...");
        this.button.watch((err, value) => console.log(value, "value"));
    }
    handleButtonPress(err, value) {
        console.log(value, "value");
        if (err) {
            console.log(err, "err");
            throw err;
        }
        if (value === 1) {
            console.log("Botón presionado");
        }
    }
    onModuleDestroy() {
        this.button.unwatchAll();
        this.button.unexport();
        console.log("Aplicación terminada, recursos liberados.");
    }
};
ButtonService = __decorate([
    (0, common_1.Injectable)()
], ButtonService);
exports.ButtonService = ButtonService;
//# sourceMappingURL=button.service.js.map