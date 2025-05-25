import React from 'react';
import { GreenhouseZone } from '../types';
import SensorCard from './SensorCard';
import TankLevelCard from './TankLevelCard';

interface ZoneCardProps {
  zone: GreenhouseZone;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone }) => {
  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-700">{zone.name}</h2>
        <button className="neumorphic-button px-4 py-2 text-sm text-neutral-700 flex items-center">
          <span>Settings</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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