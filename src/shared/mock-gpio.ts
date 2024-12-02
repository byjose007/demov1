export class MockGpio {
  private value: number = 0;

  constructor(private gpio: number, private direction: string) {
    console.log(`MockGpio: Initializing GPIO ${gpio} in ${direction} mode`);
  }

  writeSync(value: number): void {
    this.value = value;
    // console.log(`MockGpio: Writing ${value} to GPIO ${this.gpio}`);
  }

  readSync(): number {
    // console.log(`MockGpio: Reading from GPIO ${this.gpio}`);
    return this.value;
  }

  unexport(): void {
    console.log(`MockGpio: Unexporting GPIO ${this.gpio}`);
  }

  watch(callback: (err: Error | null, value: number) => void): void {
    console.log(`MockGpio: Watching GPIO ${this.gpio}`);
    // Simulate occasional changes
    setInterval(() => {
      this.value = Math.round(Math.random());
      callback(null, this.value);
    }, 5000);
  }

  unwatchAll(): void {}
}
