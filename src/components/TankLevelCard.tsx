import React from 'react';
import { Droplet } from 'lucide-react';
import { TankLevel } from '../types';

interface TankLevelCardProps {
  tank: TankLevel;
}

const TankLevelCard: React.FC<TankLevelCardProps> = ({ tank }) => {
  const getStatusColor = () => {
    if (tank.percentage > 50) {
      return 'bg-primary-400';
    } else if (tank.percentage > 20) {
      return 'bg-amber-400';
    } else {
      return 'bg-red-500';
    }
  };
  
  return (
    <div className="neumorphic p-4 h-full animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="mr-2">
            <Droplet className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-neutral-700">{tank.name}</h3>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-neutral-600">Level</p>
          <p className="seven-segment text-xl font-bold text-neutral-800">
            {tank.percentage}<span className="text-sm ml-1">%</span>
          </p>
        </div>
        
        <div className="neumorphic-inset h-6 w-full rounded-md overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${tank.percentage}%`,
              background: `linear-gradient(90deg, #4ade80 0%, #22c55e 100%)`,
              borderRadius: '4px'
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        
        <div className="flex justify-between items-baseline mt-2">
          <p className="seven-segment text-md text-neutral-700">
            {tank.currentLevel.toFixed(1)}<span className="text-xs ml-1">{tank.unit}</span>
          </p>
          <p className="text-xs text-neutral-500">
            of {tank.maxCapacity} {tank.unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TankLevelCard;