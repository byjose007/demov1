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
exports.TrafficLightScheduleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_service_1 = require("../app.service");
let TrafficLightScheduleService = class TrafficLightScheduleService {
    constructor(appService) {
        this.appService = appService;
        this.isFlashMode = false;
    }
    async startWeekdayNormalHours() {
        if (this.isWeekday()) {
            console.log("Iniciando horario normal en día de semana - 5:00 AM");
            await this.setNormalSchedule();
        }
    }
    async startWeekdayPeakHours1() {
        if (this.isWeekday()) {
            console.log("Iniciando hora pico en día de semana - 6:30 AM");
            await this.setPeakSchedule();
        }
    }
    async startWeekdayNormalHours2() {
        if (this.isWeekday()) {
            console.log("Volviendo a horario normal en día de semana - 8:31 AM");
            await this.setNormalSchedule();
        }
    }
    async startWeekdayPeakHours2() {
        if (this.isWeekday()) {
            console.log("Iniciando hora pico en día de semana - 11:30 AM");
            await this.setPeakSchedule();
        }
    }
    async startWeekdayNormalHours3() {
        if (this.isWeekday()) {
            console.log("Volviendo a horario normal en día de semana - 13:31 PM");
            await this.setNormalSchedule();
        }
    }
    async startWeekdayPeakHours3() {
        if (this.isWeekday()) {
            console.log("Iniciando hora pico en día de semana - 16:30 PM");
            await this.setPeakSchedule();
        }
    }
    async startWeekdayNormalHours4() {
        if (this.isWeekday()) {
            console.log("Volviendo a horario normal en día de semana - 19:31 PM");
            await this.setNormalSchedule();
        }
    }
    async startWeekdayFlashMode() {
        if (this.isWeekday()) {
            console.log("Iniciando modo flasheo en día de semana - 22:00 PM");
            await this.setFlashMode();
        }
    }
    async startWeekendNormalHours() {
        if (!this.isWeekday()) {
            console.log("Iniciando horario normal en fin de semana - 5:00 AM");
            await this.setNormalSchedule();
        }
    }
    async startWeekendFlashMode() {
        if (!this.isWeekday()) {
            console.log("Iniciando modo flasheo en fin de semana - 22:00 PM");
            await this.setFlashMode();
        }
    }
    async setNormalSchedule() {
        this.isFlashMode = false;
        const normalTimings = this.appService.getNormalTimings();
        await this.updateTrafficLightTiming(normalTimings.green, normalTimings.yellow, normalTimings.red);
    }
    async setPeakSchedule() {
        this.isFlashMode = false;
        const peakTimings = this.appService.getPeakTimings();
        await this.updateTrafficLightTiming(peakTimings.green, peakTimings.yellow, peakTimings.red);
    }
    async setFlashMode() {
        this.isFlashMode = true;
        await this.appService.flasheo(true);
    }
    async updateTrafficLightTiming(greenDuration, yellowDuration, redDuration) {
        this.appService.updateIntersectionTimings(greenDuration, yellowDuration, redDuration);
        console.log(`Actualizando tiempos: Verde ${greenDuration}s, Amarillo ${yellowDuration}s, Rojo ${redDuration}s`);
        await this.appService.stopTraffic(false, false);
        await this.appService.startTrafficLightCycle(true);
    }
    isWeekday() {
        const day = new Date().getDay();
        return day >= 1 && day <= 5;
    }
};
__decorate([
    (0, schedule_1.Cron)("0 5 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayNormalHours", null);
__decorate([
    (0, schedule_1.Cron)("30 6 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayPeakHours1", null);
__decorate([
    (0, schedule_1.Cron)("31 8 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayNormalHours2", null);
__decorate([
    (0, schedule_1.Cron)("30 11 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayPeakHours2", null);
__decorate([
    (0, schedule_1.Cron)("31 13 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayNormalHours3", null);
__decorate([
    (0, schedule_1.Cron)("30 16 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayPeakHours3", null);
__decorate([
    (0, schedule_1.Cron)("31 19 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayNormalHours4", null);
__decorate([
    (0, schedule_1.Cron)("0 22 * * 1-5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekdayFlashMode", null);
__decorate([
    (0, schedule_1.Cron)("0 5 * * 0,6"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekendNormalHours", null);
__decorate([
    (0, schedule_1.Cron)("0 22 * * 0,6"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrafficLightScheduleService.prototype, "startWeekendFlashMode", null);
TrafficLightScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], TrafficLightScheduleService);
exports.TrafficLightScheduleService = TrafficLightScheduleService;
//# sourceMappingURL=traffic-light-schedule-service.js.map