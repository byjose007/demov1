export interface TrafficLightStatus {
    red: boolean;
    yellow: boolean;
    green: boolean;
  }
  
  export interface TrafficState {
    intersections: {
      [key: number]: TrafficLightStatus;
    };
    currentMode: string;
    timestamp: number;
  }
  
  export interface TimingConfig {
    red: number;
    yellow: number;
    green: number;
  }
  
  export interface IntersectionConfig {
    id: number;
    pins: {
      red: number;
      yellow: number;
      green: number;
    };
    timings: TimingConfig;
  }