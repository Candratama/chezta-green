import React from 'react';
import { Thermometer, Droplets, Wind, Zap } from 'lucide-react';
import { GreenhouseZone } from '../types';
import SensorCard from './SensorCard';
import TankLevelCard from './TankLevelCard';
import ChartCard from './ChartCard';
import { useChartData } from '../hooks/useChartData';

interface ZoneCardProps {
  zone: GreenhouseZone;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone }) => {
  const chartData = useChartData([zone]);
  const zoneChartData = chartData[zone.id];

  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-700">{zone.name}</h2>
        <button className="neumorphic-button px-4 py-2 text-sm text-neutral-700 flex items-center">
          <span>Settings</span>
        </button>
      </div>
      
      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SensorCard 
          title="Temperature" 
          reading={zone.temperature} 
          type="temperature"
        />
        <SensorCard 
          title="Humidity" 
          reading={zone.humidity} 
          type="humidity"
        />
        <SensorCard 
          title="CO₂ Level" 
          reading={zone.co2} 
          type="co2"
        />
        <SensorCard 
          title="Light Intensity" 
          reading={zone.light} 
          type="light"
        />
      </div>

      {/* Chart Cards Grid */}
      {zoneChartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ChartCard
            title="Temperature Trend"
            data={zoneChartData.temperature || []}
            unit="°C"
            color="#f97316"
            icon={<Thermometer className="h-5 w-5" />}
            status={zone.temperature.status}
            large={false}
          />
          <ChartCard
            title="Humidity Trend"
            data={zoneChartData.humidity || []}
            unit="%"
            color="#3b82f6"
            icon={<Droplets className="h-5 w-5" />}
            status={zone.humidity.status}
            large={false}
          />
          <ChartCard
            title="CO₂ Level Trend"
            data={zoneChartData.co2 || []}
            unit="PPM"
            color="#8b5cf6"
            icon={<Wind className="h-5 w-5" />}
            status={zone.co2.status}
            large={false}
          />
          <ChartCard
            title="Light Intensity Trend"
            data={zoneChartData.light || []}
            unit="lux"
            color="#f59e0b"
            icon={<Zap className="h-5 w-5" />}
            status={zone.light.status}
            large={false}
          />
        </div>
      )}
      
      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="neumorphic p-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Moisture Level</h3>
          <SensorCard 
            title="Soil Moisture" 
            reading={zone.moisture} 
            type="moisture"
          />
        </div>
        <div className="neumorphic p-4">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Tank Levels</h3>
          <div className="grid grid-cols-1 gap-4">
            {zone.tanks.map(tank => (
              <TankLevelCard key={tank.id} tank={tank} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;