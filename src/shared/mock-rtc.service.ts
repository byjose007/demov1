// mock-i2c.ts
export class MockI2C {
  private static instance: MockI2C;
  private memoryMap: Map<number, Buffer> = new Map();

  private constructor() {}

  static getInstance(): MockI2C {
    if (!this.instance) {
      this.instance = new MockI2C();
    }
    return this.instance;
  }

  openSync(): MockI2C {
    return this;
  }

  closeSync(): void {
    // No-op in mock
  }

  readByteSync(addr: number, cmd: number): number {
    const buffer = this.memoryMap.get(addr) || Buffer.alloc(8);
    return buffer[cmd] || 0;
  }

  writeByteSync(addr: number, cmd: number, byte: number): void {
    let buffer = this.memoryMap.get(addr) || Buffer.alloc(8);
    buffer[cmd] = byte;
    this.memoryMap.set(addr, buffer);
  }

  readI2cBlockSync(addr: number, cmd: number, length: number, buffer: Buffer): void {
    const mockData = this.generateMockData(length);
    mockData.copy(buffer);
  }

  writeI2cBlockSync(addr: number, cmd: number, length: number, buffer: Buffer): void {
    this.memoryMap.set(addr, Buffer.from(buffer));
  }

  private generateMockData(length: number): Buffer {
    const now = new Date();
    const buffer = Buffer.alloc(length);
    
    // Mock RTC data format
    buffer[0] = now.getSeconds();
    buffer[1] = now.getMinutes();
    buffer[2] = now.getHours();
    buffer[3] = now.getDay() + 1;
    buffer[4] = now.getDate();
    buffer[5] = now.getMonth() + 1;
    buffer[6] = now.getFullYear() - 2000;
    
    return buffer;
  }
}