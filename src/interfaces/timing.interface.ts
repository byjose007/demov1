export interface TimingConfig {
    red: number;
    yellow: number;
    green: number;
  }
  
  export interface IntersectionStatus {
    id: number;
    status: {
      red: boolean;
      yellow: boolean;
      green: boolean;
    };
    mode: string;
    lastUpdate: Date;
  }
  
  export interface SystemConfig {
    flashInterval: number;
    flashOffDuration: number;
    pedestrianCrossingDuration: number;
  }