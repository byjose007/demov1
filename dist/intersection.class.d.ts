export interface Durations {
    red: number;
    yellow: number;
    green: number;
}
export declare class Intersection {
    private redLed;
    private yellowLed;
    private greenLed;
    private redDuration;
    private greenDuration;
    private yellowDuration;
    constructor(redPin: number, yellowPin: number, greenPin: number, durations: Durations);
    updateDurations(durations: Durations): void;
    get getRedDuration(): number;
    get getGreenDuration(): number;
    get getYellowDuration(): number;
    turnRed(): Promise<any>;
    turnYellow(): Promise<any>;
    turnGreen(): Promise<any>;
    stopTrafficLightCycle(): Promise<any>;
    startPeaton(): Promise<any>;
    getStatus(): {
        red: boolean;
        yellow: boolean;
        green: boolean;
    };
}
