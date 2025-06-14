import React, { useState } from 'react';
import SensorChartCard, { TimePeriod } from './SensorChartCard';
import { useStore } from '../store';
import { Thermometer, Droplets, Wind, Sun, TrendingUp } from 'lucide-react';

const timePeriodOptions: { value: TimePeriod; label: string }[] = [
  { value: '30s', label: 'Last 30 seconds' },
  { value: '1m', label: 'Last 1 minute' },
  { value: '1h', label: 'Last 1 hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '24h', label: 'Last 24 hours' },
];

const SensorChartsContainer: React.FC = () => {
  const { zones, sensorHistory } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1h');

  // If no zones are available, show placeholder
  if (!zones || zones.length === 0) {
    return (
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-700 mb-2">Sensor Trends</h2>
          <p className="text-neutral-500">Real-time sensor data visualization with historical trends</p>
        </div>
        <div className="neumorphic p-6 bg-white rounded-xl text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">Loading sensor data...</h3>
            <p className="text-neutral-500">Please wait while we connect to your greenhouse sensors.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="neumorphic p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-700">Sensor Trends</h2>
            </div>
            <p className="text-neutral-500">Real-time sensor data visualization with historical trends</p>
          </div>
          
          {/* Centralized Time Period Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="timePeriod" className="text-sm font-medium text-neutral-700">
              Time Range:
            </label>
            <select
              id="timePeriod"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
              className="neumorphic-inset px-3 py-1 text-sm text-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timePeriodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Charts organized by zone */}
      {zones.map((zone) => (
        <div key={zone.id} className="mb-8">
          <div className="neumorphic p-3 rounded-lg mb-4 inline-block">
            <h3 className="text-xl font-semibold text-neutral-700">{zone.name}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <SensorChartCard
              title="Temperature"
              unit={zone.temperature.unit}
              data={sensorHistory.temperature}
              color="#ef4444"
              currentValue={zone.temperature.value}
              status={zone.temperature.status}
              selectedPeriod={selectedPeriod}
              icon={<Thermometer className="w-5 h-5" />}
            />
            
            <SensorChartCard
              title="Humidity"
              unit={zone.humidity.unit}
              data={sensorHistory.humidity}
              color="#3b82f6"
              currentValue={zone.humidity.value}
              status={zone.humidity.status}
              selectedPeriod={selectedPeriod}
              icon={<Droplets className="w-5 h-5" />}
            />
            
            <SensorChartCard
              title="CO Level"
              unit={zone.co2.unit}
              data={sensorHistory.co2}
              color="#10b981"
              currentValue={zone.co2.value}
              status={zone.co2.status}
              selectedPeriod={selectedPeriod}
              icon={<Wind className="w-5 h-5" />}
            />
            
            <SensorChartCard
              title="Light Intensity"
              unit={zone.light.unit}
              data={sensorHistory.light}
              color="#f59e0b"
              currentValue={zone.light.value}
              status={zone.light.status}
              selectedPeriod={selectedPeriod}
              icon={<Sun className="w-5 h-5" />}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SensorChartsContainer; 