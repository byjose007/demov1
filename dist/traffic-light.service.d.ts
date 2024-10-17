export declare class TrafficLightService {
    private redLed;
    private yellowLed;
    private greenLed;
    private redDuration;
    private greenDuration;
    private yellowDuration;
    constructor(redPin: number, yellowPin: number, greenPin: number, durations: any);
    private turnRed;
    private turnYellow;
    private turnGreen;
    startTrafficLightCycle(): Promise<void>;
    private sleep;
    createIntersection(redPin: number, yellowPin: number, greenPin: number, durations: any): TrafficLightService;
    stopTrafficLightCycle(): void;
}
