"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const axios_1 = require("@nestjs/axios");
const schedule_1 = require("@nestjs/schedule");
const button_service_1 = require("./button.service");
const traffic_light_schedule_service_1 = require("./traffic-light-schedule-service/traffic-light-schedule-service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, schedule_1.ScheduleModule.forRoot()],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, button_service_1.ButtonService, traffic_light_schedule_service_1.TrafficLightScheduleService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map