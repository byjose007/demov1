import { OnModuleInit } from "@nestjs/common";
import { Intersection } from "./intersection.class";
export declare class AppService implements OnModuleInit {
    isFlaseo: boolean;
    isInit: boolean;
    shouldContinueCycle: boolean;
    intersection1: Intersection;
    intersection2: Intersection;
    intersection3: Intersection;
    intersection4: Intersection;
    peaton1: Intersection;
    private normalTimings;
    private peakTimings;
    constructor();
    onModuleInit(): void;
    updateNormalTimings(greenDuration: number, yellowDuration: number, redDuration: number): void;
    updatePeakTimings(greenDuration: number, yellowDuration: number, redDuration: number): void;
    getNormalTimings(): {
        red: number;
        yellow: number;
        green: number;
    };
    getPeakTimings(): {
        red: number;
        yellow: number;
        green: number;
    };
    getIntersectionsStatus(): {
        red: boolean;
        yellow: boolean;
        green: boolean;
    }[];
    private getInitialTimings;
    updateIntersectionTimings(greenDuration: number, yellowDuration: number, redDuration: number): void;
    startTrafficLightCycle(isInit?: boolean): Promise<void>;
    private sleep;
    stopTraffic(init?: boolean, flash?: boolean): Promise<any>;
    stopCycle(): Promise<void>;
    startPeaton(): Promise<void>;
    flasheo(isFlaseo?: boolean): Promise<void>;
}
