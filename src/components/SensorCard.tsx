import React from 'react';
import { Thermometer, Droplets, Zap, Gauge, Wind } from 'lucide-react';
import { SensorReading } from '../types';

interface SensorCardProps {
  title: string;
  reading: SensorReading;
  type: 'temperature' | 'humidity' | 'co2' | 'light' | 'moisture';
  large?: boolean;
}

const SensorCard: React.FC<SensorCardProps> = ({ 
  title, 
  reading, 
  type,
  large = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 'humidity':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'co2':
        return <Wind className="h-5 w-5 text-purple-500" />;
      case 'light':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'moisture':
        return <Gauge className="h-5 w-5 text-primary-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (reading.status) {
      case 'normal':
        return 'bg-primary-400';
      case 'warning':
        return 'bg-amber-400';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div className={`neumorphic p-4 ${large ? 'col-span-2' : 'col-span-1'} animate-fade-in`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="mr-2">{getIcon()}</div>
          <h3 className="text-sm font-medium text-neutral-700">{title}</h3>
        </div>
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
      </div>
      
      <div className="flex flex-col mt-4">
        <div className="neumorphic-inset px-3 py-2 rounded-lg">
          <div className="flex flex-col">
            <span className="seven-segment text-3xl font-bold text-neutral-500">
              {typeof reading.value === 'number' ? reading.value.toFixed(1) : reading.value}
            </span>
            <span className="text-sm text-neutral-500 self-end">{reading.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;