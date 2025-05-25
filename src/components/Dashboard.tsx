import React, { useEffect, useRef } from 'react';
import StatusHeader from './StatusHeader';
import ZoneCard from './ZoneCard';
import PPMCalibrator from './PPMCalibrator';
import { generateMockZoneData, getConnectionStatus } from '../data/mockData';
import { useStore } from '../store';

const Dashboard: React.FC = () => {
  const {
    zones,
    connectionStatus,
    lastUpdated,
    showSettings,
    settings,
    controls,
    setZones,
    setConnectionStatus,
    setLastUpdated,
    setShowSettings,
    toggleControl,
    updateSetting
  } = useStore();
  
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockData = generateMockZoneData();
    setZones(mockData);
    setConnectionStatus(getConnectionStatus());
    setLastUpdated(new Date());

    const dataInterval = setInterval(() => {
      const newMockData = generateMockZoneData();
      setZones(newMockData);
      setConnectionStatus(getConnectionStatus());
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(dataInterval);
  }, [setZones, setConnectionStatus, setLastUpdated]);

  useEffect(() => {
    if (showSettings && settingsRef.current) {
      settingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSettings]);

  const handlePPMCalibration = (value: number) => {
    console.log('PPM Calibrated to:', value);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <StatusHeader connected={connectionStatus} lastUpdated={lastUpdated} />
      
      <main>
        {zones.map(zone => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </main>
      
      <div className="mt-6 space-y-4">
        <div className="neumorphic p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-700">Controls</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="neumorphic-button px-4 py-2 text-sm text-neutral-700 hover:opacity-90"
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {controls.map((control, index) => (
              <button 
                key={control.name}
                onClick={() => toggleControl(index)}
                className="neumorphic-button p-4 text-center transition-all duration-200 hover:opacity-90 active:scale-95"
              >
                <p className="text-sm font-medium text-neutral-700">{control.name}</p>
                <p className={`seven-segment text-lg ${control.color} mt-1`}>{control.state}</p>
              </button>
            ))}
          </div>
        </div>

        {showSettings && (
          <div ref={settingsRef} className="neumorphic p-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-600">Temperature Control (°C)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={settings.temperature.min}
                      onChange={(e) => updateSetting('temperature', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.temperature.max}
                      onChange={(e) => updateSetting('temperature', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <PPMCalibrator onCalibrate={handlePPMCalibration} />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-600">Humidity Control (%)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={settings.humidity.min}
                      onChange={(e) => updateSetting('humidity', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.humidity.max}
                      onChange={(e) => updateSetting('humidity', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-600">CO₂ Level (PPM)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={settings.co2.min}
                      onChange={(e) => updateSetting('co2', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.co2.max}
                      onChange={(e) => updateSetting('co2', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-600">Lighting Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={settings.light.startTime}
                      onChange={(e) => updateSetting('light', 'startTime', e.target.value)}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={settings.light.endTime}
                      onChange={(e) => updateSetting('light', 'endTime', e.target.value)}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="neumorphic-button px-4 py-2 text-sm text-neutral-600 hover:opacity-90"
              >
                Cancel
              </button>
              <button
                className="neumorphic-button px-4 py-2 text-sm text-primary-600 hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;