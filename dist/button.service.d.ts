import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
export declare class ButtonService implements OnModuleInit, OnModuleDestroy {
    private button;
    private redLed;
    private readonly buttonPin;
    onModuleInit(): void;
    private handleButtonPress;
    onModuleDestroy(): void;
}
