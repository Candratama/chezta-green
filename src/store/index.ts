import { create } from 'zustand';
import { GreenhouseZone, ControlState, Settings } from '../types';

export interface SensorDataPoint {
  timestamp: Date;
  value: number;
}

export interface SensorHistory {
  temperature: SensorDataPoint[];
  humidity: SensorDataPoint[];
  co2: SensorDataPoint[];
  light: SensorDataPoint[];
}

interface State {
  zones: GreenhouseZone[];
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  lastUpdated: Date;
  showSettings: boolean;
  settings: Settings;
  controls: ControlState[];
  sensorHistory: SensorHistory;
  ppmCalibrator: {
    selectedPreset: string;
    ppmValue: number;
    status: string;
    waiting: boolean;
  };
  setZones: (zones: GreenhouseZone[] | ((current: GreenhouseZone[]) => GreenhouseZone[])) => void;
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void;
  setLastUpdated: (date: Date) => void;
  setShowSettings: (show: boolean) => void;
  setSettings: (settings: Settings) => void;
  toggleControl: (index: number) => void;
  updateSetting: (category: keyof Settings, field: string, value: string | number) => void;
  addSensorDataPoint: (sensor: keyof SensorHistory, dataPoint: SensorDataPoint) => void;
  initializeSensorHistory: () => void;
  setPPMPreset: (preset: string) => void;
  setPPMValue: (value: number) => void;
  setPPMStatus: (status: string) => void;
  setPPMWaiting: (waiting: boolean) => void;
}

// Generate mock historical data for a sensor with fewer data points for cleaner charts
const generateHistoricalData = (currentValue: number, hours: number = 24): SensorDataPoint[] => {
  const data: SensorDataPoint[] = [];
  const now = new Date();
  const interval = (hours * 60 * 60 * 1000) / 50; // 50 data points over the time period for cleaner charts
  
  for (let i = 49; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * interval));
    // Add some realistic variation around the current value
    const variation = (Math.random() - 0.5) * (currentValue * 0.1);
    const value = Math.max(0, currentValue + variation);
    data.push({ timestamp, value: Math.round(value * 100) / 100 });
  }
  
  return data;
};

export const useStore = create<State>((set) => ({
  zones: [],
  connectionStatus: 'connecting',
  lastUpdated: new Date(),
  showSettings: false,
  settings: {
    temperature: { min: 20, max: 30 },
    humidity: { min: 60, max: 80 },
    co2: { min: 600, max: 1200 },
    light: { startTime: '06:00', endTime: '18:00' },
  },
  controls: [
    { name: 'Irrigation', state: 'ON', color: 'text-primary-500', allowAuto: false },
    { name: 'Lighting', state: 'ON', color: 'text-primary-500', allowAuto: true },
    { name: 'Ventilation', state: 'OFF', color: 'text-neutral-500', allowAuto: false },
    { name: 'Heating', state: 'ON', color: 'text-primary-500', allowAuto: false },
  ],
  sensorHistory: {
    temperature: generateHistoricalData(25),
    humidity: generateHistoricalData(70),
    co2: generateHistoricalData(800),
    light: generateHistoricalData(1000),
  },
  ppmCalibrator: {
    selectedPreset: 'LETTUCE',
    ppmValue: 1000,
    status: 'IDEAL',
    waiting: false,
  },
  setZones: (zones) => set((state) => ({
    zones: typeof zones === 'function' ? zones(state.zones) : zones
  })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
  setShowSettings: (show) => set({ showSettings: show }),
  setSettings: (settings) => set({ settings }),
  toggleControl: (index) => set((state) => {
    const newControls = [...state.controls];
    const control = newControls[index];
    
    if (control.allowAuto) {
      switch (control.state) {
        case 'OFF':
          control.state = 'ON';
          control.color = 'text-primary-500';
          break;
        case 'ON':
          control.state = 'AUTO';
          control.color = 'text-primary-500';
          break;
        case 'AUTO':
          control.state = 'OFF';
          control.color = 'text-neutral-500';
          break;
      }
    } else {
      control.state = control.state === 'ON' ? 'OFF' : 'ON';
      control.color = control.state === 'ON' ? 'text-primary-500' : 'text-neutral-500';
    }
    
    return { controls: newControls };
  }),
  updateSetting: (category, field, value) => set((state) => ({
    settings: {
      ...state.settings,
      [category]: {
        ...state.settings[category],
        [field]: value
      }
    }
  })),
  setPPMPreset: (preset) => set((state) => ({
    ppmCalibrator: { ...state.ppmCalibrator, selectedPreset: preset }
  })),
  setPPMValue: (value) => set((state) => ({
    ppmCalibrator: { ...state.ppmCalibrator, ppmValue: value }
  })),
  setPPMStatus: (status) => set((state) => ({
    ppmCalibrator: { ...state.ppmCalibrator, status: status }
  })),
  setPPMWaiting: (waiting) => set((state) => ({
    ppmCalibrator: { ...state.ppmCalibrator, waiting: waiting }
  })),
  addSensorDataPoint: (sensor, dataPoint) => set((state) => {
    const updatedHistory = [...state.sensorHistory[sensor]];
    updatedHistory.push(dataPoint);
    
    // Keep only the last 300 data points to prevent memory issues and reduce chart density
    if (updatedHistory.length > 300) {
      updatedHistory.shift();
    }
    
    return {
      sensorHistory: {
        ...state.sensorHistory,
        [sensor]: updatedHistory
      }
    };
  }),
  
  initializeSensorHistory: () => set(() => ({
    sensorHistory: {
      temperature: generateHistoricalData(25),
      humidity: generateHistoricalData(70),
      co2: generateHistoricalData(800),
      light: generateHistoricalData(1000),
    }
  })),
  

}));