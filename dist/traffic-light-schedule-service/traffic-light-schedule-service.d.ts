import { AppService } from "../app.service";
export declare class TrafficLightScheduleService {
    private readonly appService;
    constructor(appService: AppService);
    private isFlashMode;
    startWeekdayNormalHours(): Promise<void>;
    startWeekdayPeakHours1(): Promise<void>;
    startWeekdayNormalHours2(): Promise<void>;
    startWeekdayPeakHours2(): Promise<void>;
    startWeekdayNormalHours3(): Promise<void>;
    startWeekdayPeakHours3(): Promise<void>;
    startWeekdayNormalHours4(): Promise<void>;
    startWeekdayFlashMode(): Promise<void>;
    startWeekendNormalHours(): Promise<void>;
    startWeekendFlashMode(): Promise<void>;
    private setNormalSchedule;
    private setPeakSchedule;
    private setFlashMode;
    private updateTrafficLightTiming;
    private isWeekday;
}
