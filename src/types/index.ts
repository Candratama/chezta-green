// Core types for the greenhouse monitoring application

export interface SensorReading {
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface TemperatureSensor extends SensorReading {
  unit: '°C' | '°F';
}

export interface HumiditySensor extends SensorReading {
  unit: '%';
}

export interface PPMSensor extends SensorReading {
  unit: 'PPM';
  type: 'CO2' | 'Nutrients' | 'Other';
}

export interface LightSensor extends SensorReading {
  unit: 'lux' | '%';
}

export interface MoistureSensor extends SensorReading {
  unit: '%';
}

export interface TankLevel {
  id: string;
  name: string;
  currentLevel: number;
  maxCapacity: number;
  unit: 'L' | 'gal';
  percentage: number;
}

export interface GreenhouseZone {
  id: string;
  name: string;
  temperature: TemperatureSensor;
  humidity: HumiditySensor;
  co2: PPMSensor;
  light: LightSensor;
  moisture: MoistureSensor;
  tanks: TankLevel[];
}

export interface ControlState {
  name: string;
  state: 'ON' | 'OFF' | 'AUTO';
  color: string;
  allowAuto?: boolean;
}

export interface Settings {
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
  co2: {
    min: number;
    max: number;
  };
  light: {
    startTime: string;
    endTime: string;
  };
}