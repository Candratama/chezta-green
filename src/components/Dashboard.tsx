import React, { useEffect, useRef } from 'react';
import StatusHeader from './StatusHeader';
import ZoneCard from './ZoneCard';
import PPMCalibrator from './PPMCalibrator';
import SensorChartsContainer from './SensorChartsContainer';
import { useStore } from '../store';
import { useWebSocket } from '../hooks/useWebSocket';

const Dashboard: React.FC = () => {
  const {
    zones,
    connectionStatus,
    lastUpdated,
    showSettings,
    settings,
    controls,
    setShowSettings,
    toggleControl,
    updateSetting
  } = useStore();
  
  const { sendControlUpdate, sendSettingsUpdate, sendPPMCalibration } = useWebSocket();
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSettings && settingsRef.current) {
      settingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSettings]);

  const handleControlToggle = (index: number) => {
    const control = controls[index];
    let newState: string;
    
    if (control.allowAuto) {
      switch (control.state) {
        case 'OFF':
          newState = 'ON';
          break;
        case 'ON':
          newState = 'AUTO';
          break;
        case 'AUTO':
          newState = 'OFF';
          break;
        default:
          newState = 'OFF';
      }
    } else {
      newState = control.state === 'ON' ? 'OFF' : 'ON';
    }
    
    // Update local state immediately for responsive UI
    toggleControl(index);
    
    // Send update to server
    sendControlUpdate(index, newState);
  };

  const handleSettingUpdate = (category: keyof typeof settings, field: string, value: string | number) => {
    // Update local state immediately
    updateSetting(category, field, value);
    
    // Send update to server (debounced in real implementation)
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    };
    sendSettingsUpdate(updatedSettings);
  };

  const handlePPMCalibration = (value: number) => {
    console.log('PPM Calibrated to:', value);
    sendPPMCalibration({ value, timestamp: new Date().toISOString() });
  };

  const handleSaveSettings = () => {
    sendSettingsUpdate(settings);
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <StatusHeader connected={connectionStatus} lastUpdated={lastUpdated} />
      
      <main>
        {zones.length === 0 ? (
          <div className="neumorphic p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-primary-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-neutral-700 mb-2">
                {connectionStatus === 'connecting' ? 'Connecting to greenhouse...' : 'No zones detected'}
              </h3>
              <p className="text-neutral-500">
                {connectionStatus === 'connecting' 
                  ? 'Please wait while we establish connection with your greenhouse sensors.'
                  : 'Check your connection and try again.'
                }
              </p>
            </div>
          </div>
        ) : (
          zones.map(zone => (
            <ZoneCard key={zone.id} zone={zone} />
          ))
        )}
      </main>
      
      <SensorChartsContainer />
      
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
                onClick={() => handleControlToggle(index)}
                className="neumorphic-button p-4 text-center transition-all duration-200 hover:opacity-90 active:scale-95"
                disabled={connectionStatus !== 'connected'}
              >
                <p className="text-sm font-medium text-neutral-700">{control.name}</p>
                <p className={`seven-segment text-lg ${control.color} mt-1`}>{control.state}</p>
                {connectionStatus !== 'connected' && (
                  <div className="absolute inset-0 bg-neutral-200 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-neutral-500">Offline</span>
                  </div>
                )}
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
                      onChange={(e) => handleSettingUpdate('temperature', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.temperature.max}
                      onChange={(e) => handleSettingUpdate('temperature', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
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
                      onChange={(e) => handleSettingUpdate('humidity', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.humidity.max}
                      onChange={(e) => handleSettingUpdate('humidity', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
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
                      onChange={(e) => handleSettingUpdate('co2', 'min', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={settings.co2.max}
                      onChange={(e) => handleSettingUpdate('co2', 'max', Number(e.target.value))}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
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
                      onChange={(e) => handleSettingUpdate('light', 'startTime', e.target.value)}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={settings.light.endTime}
                      onChange={(e) => handleSettingUpdate('light', 'endTime', e.target.value)}
                      className="neumorphic-inset w-full p-2 text-neutral-700 rounded-md"
                      disabled={connectionStatus !== 'connected'}
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
                onClick={handleSaveSettings}
                className="neumorphic-button px-4 py-2 text-sm text-primary-600 hover:opacity-90"
                disabled={connectionStatus !== 'connected'}
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