import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subSeconds, subMinutes, subHours } from 'date-fns';
import { AlertCircle, CheckCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type TimePeriod = '30s' | '1m' | '1h' | '6h' | '12h' | '24h';

interface SensorDataPoint {
  timestamp: Date;
  value: number;
}

interface SensorChartCardProps {
  title: string;
  unit: string;
  data: SensorDataPoint[];
  color: string;
  currentValue: number;
  status: 'normal' | 'warning' | 'critical';
  selectedPeriod: TimePeriod;
  icon: React.ReactNode;
}

const SensorChartCard: React.FC<SensorChartCardProps> = ({
  title,
  unit,
  data,
  color,
  currentValue,
  status,
  selectedPeriod,
  icon,
}) => {

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoffTime: Date;

    switch (selectedPeriod) {
      case '30s':
        cutoffTime = subSeconds(now, 30);
        break;
      case '1m':
        cutoffTime = subMinutes(now, 1);
        break;
      case '1h':
        cutoffTime = subHours(now, 1);
        break;
      case '6h':
        cutoffTime = subHours(now, 6);
        break;
      case '12h':
        cutoffTime = subHours(now, 12);
        break;
      case '24h':
        cutoffTime = subHours(now, 24);
        break;
      default:
        cutoffTime = subHours(now, 1);
    }

    const filtered = data.filter(point => point.timestamp >= cutoffTime);
    
    // Reduce number of data points to make chart less dense
    const maxPoints = selectedPeriod === '30s' || selectedPeriod === '1m' ? 20 : 
                     selectedPeriod === '1h' ? 30 : 
                     selectedPeriod === '6h' ? 40 : 50;
    
    if (filtered.length <= maxPoints) {
      return filtered;
    }
    
    // Sample data points evenly
    const step = Math.ceil(filtered.length / maxPoints);
    return filtered.filter((_, index) => index % step === 0);
  }, [data, selectedPeriod]);

  const chartData = {
    labels: filteredData.map(point => {
      const formatString = selectedPeriod === '30s' || selectedPeriod === '1m' 
        ? 'HH:mm:ss' 
        : selectedPeriod === '1h' 
        ? 'HH:mm' 
        : 'HH:mm';
      return format(point.timestamp, formatString);
    }),
    datasets: [
      {
        label: title,
        data: filteredData.map(point => point.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${title}: ${context.parsed.y}${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return `${value}${unit}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="neumorphic p-4 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-container p-2 rounded-lg" style={{ color }}>
            {icon}
          </div>
          <h3 className="text-md font-semibold text-neutral-700">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="sensor-value px-4 py-2 rounded-lg">
            <span className={`text-lg font-bold ${getStatusColor(status)} seven-segment`}>
              {currentValue}{unit}
            </span>
          </div>
          {getStatusIcon(status)}
        </div>
      </div>

      <div className="h-48 relative">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensorChartCard; 