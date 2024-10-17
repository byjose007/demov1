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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const intersection_class_1 = require("./intersection.class");
let AppService = class AppService {
    constructor() {
        this.isFlaseo = false;
        this.isInit = false;
        this.shouldContinueCycle = true;
        this.normalTimings = { red: 1, yellow: 3, green: 35 };
        this.peakTimings = { red: 1, yellow: 3, green: 45 };
    }
    onModuleInit() {
        console.log("Inicializando intersecciones...");
        const initialTimings = this.getInitialTimings();
        this.intersection1 = new intersection_class_1.Intersection(17, 27, 22, initialTimings);
        this.intersection2 = new intersection_class_1.Intersection(6, 13, 19, initialTimings);
        this.intersection3 = new intersection_class_1.Intersection(12, 16, 20, initialTimings);
        this.peaton1 = new intersection_class_1.Intersection(21, 0, 26, {
            red: 1,
            yellow: 0,
            green: 10,
        });
    }
    updateNormalTimings(greenDuration, yellowDuration, redDuration) {
        this.normalTimings = {
            red: redDuration,
            yellow: yellowDuration,
            green: greenDuration,
        };
    }
    updatePeakTimings(greenDuration, yellowDuration, redDuration) {
        this.peakTimings = {
            red: redDuration,
            yellow: yellowDuration,
            green: greenDuration,
        };
    }
    getNormalTimings() {
        return this.normalTimings;
    }
    getPeakTimings() {
        return this.peakTimings;
    }
    getIntersectionsStatus() {
        const statusObject = {
            intersection1: this.intersection1.getStatus(),
            intersection2: this.intersection2.getStatus(),
            intersection3: this.intersection3.getStatus(),
        };
        return Object.values(statusObject);
    }
    getInitialTimings() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        if (day === 0 || day === 6) {
            console.log("getInitialTimings ---> Horario normal todo el día");
            return this.normalTimings;
        }
        if ((hour === 6 && minute >= 30) ||
            hour === 7 ||
            (hour === 8 && minute <= 30) ||
            (hour === 11 && minute >= 30) ||
            hour === 12 ||
            (hour === 13 && minute <= 30) ||
            (hour === 16 && minute >= 30) ||
            hour === 17 ||
            hour === 18 ||
            (hour === 19 && minute <= 30)) {
            console.log("getInitialTimings ---> Hora pico");
            return this.peakTimings;
        }
        else if (hour >= 22 || hour < 5) {
            console.log("getInitialTimings ---> Modo flasheo");
            return { red: 1, yellow: 1, green: 1 };
        }
        else {
            console.log("getInitialTimings ---> Horario normal");
            return this.normalTimings;
        }
    }
    updateIntersectionTimings(greenDuration, yellowDuration, redDuration) {
        const newDurations = {
            red: redDuration,
            yellow: yellowDuration,
            green: greenDuration,
        };
        this.intersection1.updateDurations(newDurations);
        this.intersection2.updateDurations(newDurations);
        this.intersection3.updateDurations(newDurations);
    }
    async startTrafficLightCycle(isInit = true) {
        this.isInit = isInit;
        this.shouldContinueCycle = true;
        this.isFlaseo = false;
        await this.stopTraffic(true, false);
        try {
            while (this.isInit) {
                if (this.isFlaseo)
                    break;
                console.log("-------- Inicio del ciclo de luz --------1");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnRed();
                this.intersection2.turnRed();
                this.intersection3.turnRed();
                await this.sleep(this.intersection1.getRedDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase1 ----- #2");
                console.log("Semáforo 1: Luz verde => 3");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnGreen();
                this.intersection2.turnRed();
                await this.sleep(this.intersection1.getGreenDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase1 ----- #3");
                console.log("Semáforo 1: Luz Amarillo => 2");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnYellow();
                this.intersection2.turnRed();
                this.intersection3.turnRed();
                await this.sleep(this.intersection1.getYellowDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- rojos ----- 4");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnRed();
                this.intersection2.turnRed();
                this.intersection3.turnRed();
                await this.sleep(this.intersection2.getRedDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase2------ #5");
                console.log("Semáforo 1: Luz Rojo => 1");
                console.log("Semáforo 2: Luz Verde => 6");
                console.log("peaton verde");
                this.intersection1.turnRed();
                this.intersection2.turnGreen();
                this.intersection3.turnRed();
                await this.sleep(this.intersection2.getGreenDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase2 ----- #6");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz Amarillo => 5");
                this.intersection1.turnRed();
                this.intersection2.turnYellow();
                this.intersection3.turnRed();
                await this.sleep(this.intersection2.getYellowDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- rojos ----- #7");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnRed();
                this.intersection2.turnRed();
                this.intersection3.turnRed();
                await this.sleep(this.intersection2.getRedDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase3 ------ #8");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnRed();
                this.intersection2.turnRed();
                this.intersection3.turnGreen();
                await this.sleep(this.intersection3.getGreenDuration);
                if (this.isFlaseo)
                    break;
                console.log("-------- Fase3 ------ #9");
                console.log("Semáforo 1: Luz roja => 1");
                console.log("Semáforo 2: Luz roja => 4");
                this.intersection1.turnRed();
                this.intersection2.turnRed();
                this.intersection3.turnYellow();
                await this.sleep(this.intersection3.getYellowDuration);
            }
            if (!this.isFlaseo) {
                await this.stopTraffic(false, false);
            }
            console.log("Salir del ciclo de semáforos");
        }
        catch (error) {
            await this.stopTraffic(false, false);
            console.log("Error en el ciclo de semáforos:", error);
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async stopTraffic(init = false, flash = false) {
        this.isInit = init;
        this.isFlaseo = flash;
        this.shouldContinueCycle = init;
        try {
            console.log("detener semáforo", this.isFlaseo);
            return await Promise.all([
                await this.intersection1.stopTrafficLightCycle(),
                await this.intersection2.stopTrafficLightCycle(),
                await this.intersection3.stopTrafficLightCycle(),
                await this.peaton1.stopTrafficLightCycle(),
            ]);
        }
        catch (e) {
            console.log(e, "error");
        }
    }
    async stopCycle() {
        await this.stopTraffic();
        this.shouldContinueCycle = false;
    }
    async startPeaton() {
        console.log("iniciar peaton");
        this.intersection1.stopTrafficLightCycle();
        this.intersection2.stopTrafficLightCycle();
        this.intersection1.turnGreen();
        this.intersection2.turnRed();
        this.peaton1.turnGreen();
        await this.sleep(15000);
        await this.intersection1.stopTrafficLightCycle();
        await this.intersection2.stopTrafficLightCycle();
        await this.peaton1.stopTrafficLightCycle();
        await this.startTrafficLightCycle();
    }
    async flasheo(isFlaseo = true) {
        await this.stopTraffic(false, true);
        this.isFlaseo = isFlaseo;
        console.log("Iniciando flasheo", this.isFlaseo);
        if (!this.isFlaseo) {
            console.log("apagar flasheo", this.isFlaseo);
            await this.stopTraffic(false, isFlaseo);
            return;
        }
        while (this.isFlaseo) {
            try {
                await this.intersection1.turnYellow();
                await this.intersection2.turnYellow();
                await this.intersection3.turnRed();
                await this.sleep(1000);
                console.log("flashhhh");
                await this.intersection1.stopTrafficLightCycle();
                await this.intersection2.stopTrafficLightCycle();
                await this.intersection3.stopTrafficLightCycle();
                await this.sleep(1000);
            }
            catch (e) {
                console.log(e, "error");
            }
        }
        await this.stopTraffic(false, false);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map