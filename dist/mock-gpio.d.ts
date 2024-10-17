export declare class MockGpio {
    private gpio;
    private direction;
    private value;
    constructor(gpio: number, direction: string);
    writeSync(value: number): void;
    readSync(): number;
    unexport(): void;
    watch(callback: (err: Error | null, value: number) => void): void;
    unwatchAll(): void;
}
