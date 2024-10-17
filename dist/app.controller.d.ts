import { AppService } from "./app.service";
import { ButtonService } from "./button.service";
export declare class AppController {
    private readonly appService;
    private buttonService;
    constructor(appService: AppService, buttonService: ButtonService);
    startTrafficLightCycle(): Promise<{
        message: string;
    }>;
    stopTrafficLightCycle(): Promise<{
        message: string;
    }>;
    flashMode(): Promise<{
        message: string;
    }>;
    getTrafficLightStatus(): {
        red: boolean;
        yellow: boolean;
        green: boolean;
    }[];
    updateTimings(timings: {
        green: number;
        yellow: number;
        red: number;
    }): {
        message: string;
    };
    startPeaton(): Promise<void>;
}
