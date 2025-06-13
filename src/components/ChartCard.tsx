import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import LineChart from './LineChart';

interface DataPoint {
  timestamp: Date;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  unit: string;
  color: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'critical';
  large?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  unit,
  color,
  icon,
  status,
  large = false
}) => {
  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  const previousValue = data.length > 1 ? data[data.length - 2].value : currentValue;
  const trend = currentValue - previousValue;
  const trendPercentage = previousValue !== 0 ? ((trend / previousValue) * 100) : 0;

  const getTrendIcon = () => {
    if (Math.abs(trend) < 0.1) return <Minus className="w-3 h-3" />;
    return trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (Math.abs(trend) < 0.1) return 'text-neutral-500';
    return trend > 0 ? 'text-primary-500' : 'text-red-500';
  };

  const getStatusColor = () => {
    switch (status) {
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
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="text-neutral-600">{icon}</div>
          <h3 className="text-sm font-medium text-neutral-700">{title}</h3>
        </div>
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
      </div>

      {/* Current Value Display */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="seven-segment text-2xl font-bold text-neutral-800">
            {currentValue.toFixed(1)}
          </span>
          <span className="text-sm text-neutral-500">{unit}</span>
        </div>
        
        {/* Trend Indicator */}
        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>
            {Math.abs(trendPercentage) < 0.1 ? '0.0' : Math.abs(trendPercentage).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="neumorphic-inset p-3 rounded-lg">
        <LineChart
          data={data}
          title={title}
          unit={unit}
          color={color}
          height={large ? 160 : 120}
          showGrid={true}
          animate={true}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs text-neutral-500 mt-3">
        <div className="flex flex-col items-center">
          <span className="font-medium">Min</span>
          <span className="seven-segment">
            {data.length > 0 ? Math.min(...data.map(d => d.value)).toFixed(1) : '0.0'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">Avg</span>
          <span className="seven-segment">
            {data.length > 0 
              ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)
              : '0.0'
            }
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">Max</span>
          <span className="seven-segment">
            {data.length > 0 ? Math.max(...data.map(d => d.value)).toFixed(1) : '0.0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;