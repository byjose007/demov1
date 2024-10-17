"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGpio = void 0;
class MockGpio {
    constructor(gpio, direction) {
        this.gpio = gpio;
        this.direction = direction;
        this.value = 0;
        console.log(`MockGpio: Initializing GPIO ${gpio} in ${direction} mode`);
    }
    writeSync(value) {
        this.value = value;
    }
    readSync() {
        return this.value;
    }
    unexport() {
        console.log(`MockGpio: Unexporting GPIO ${this.gpio}`);
    }
    watch(callback) {
        console.log(`MockGpio: Watching GPIO ${this.gpio}`);
        setInterval(() => {
            this.value = Math.round(Math.random());
            callback(null, this.value);
        }, 5000);
    }
    unwatchAll() { }
}
exports.MockGpio = MockGpio;
//# sourceMappingURL=mock-gpio.js.map