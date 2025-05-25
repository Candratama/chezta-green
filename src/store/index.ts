import { create } from 'zustand';
import { GreenhouseZone, ControlState, Settings } from '../types';
import { generateMockZoneData, getConnectionStatus } from '../data/mockData';

interface State {
  zones: GreenhouseZone[];
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  lastUpdated: Date;
  showSettings: boolean;
  settings: Settings;
  controls: ControlState[];
  ppmCalibrator: {
    selectedPreset: string;
    ppmValue: number;
    status: string;
    waiting: boolean;
  };
  setZones: (zones: GreenhouseZone[]) => void;
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void;
  setLastUpdated: (date: Date) => void;
  setShowSettings: (show: boolean) => void;
  setSettings: (settings: Settings) => void;
  toggleControl: (index: number) => void;
  updateSetting: (category: keyof Settings, field: string, value: string | number) => void;
  setPPMPreset: (preset: string) => void;
  setPPMValue: (value: number) => void;
  setPPMStatus: (status: string) => void;
  setPPMWaiting: (waiting: boolean) => void;
}

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
  ppmCalibrator: {
    selectedPreset: 'LETTUCE',
    ppmValue: 1000,
    status: 'IDEAL',
    waiting: false,
  },
  setZones: (zones) => set({ zones }),
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
}));