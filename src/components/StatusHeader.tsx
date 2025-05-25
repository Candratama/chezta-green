import React from 'react';
import { format } from 'date-fns';
import { Wifi, WifiOff } from 'lucide-react';

interface StatusHeaderProps {
  connected: 'connected' | 'connecting' | 'disconnected';
  lastUpdated: Date;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({ connected, lastUpdated }) => {
  const connectionStatusMap = {
    connected: { text: 'Connected', icon: <Wifi className="w-4 h-4 text-primary-500" />, color: 'text-primary-500' },
    connecting: { text: 'Connecting', icon: <Wifi className="w-4 h-4 text-amber-500 connecting" />, color: 'text-amber-500' },
    disconnected: { text: 'Disconnected', icon: <WifiOff className="w-4 h-4 text-red-500" />, color: 'text-red-500' },
  };

  const { text, icon, color } = connectionStatusMap[connected];
  const currentTime = format(new Date(), 'HH:mm:ss');
  const currentDate = format(new Date(), 'dd MMM yyyy');
  
  return (
    <div className="neumorphic p-4 mb-6 animate-fade-in">
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3">
        <div className="p-3 rounded-full shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 L16 0 L16 16 L0 16 Z" fill="#4B5563"/>
            <path d="M16 0 L32 0 L32 16 L16 16 Z" fill="#4ADE80"/>
            <path d="M0 16 L16 16 L16 32 L0 32 Z" fill="#4B5563"/>
            <path d="M16 16 L32 16 L32 32 L16 32 Z" fill="#4B5563"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-semibold text-neutral-700 truncate">Chezta Green</h1>
            <span className="text-xs text-neutral-500 shrink-0">v1.0</span>
          </div>
          <p className="text-sm text-neutral-500 truncate">Smart Greenhouse Monitoring</p>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col items-center sm:flex-row sm:justify-between text-sm gap-2">
        <div className={`flex items-center gap-1.5 ${color}`}>
          {icon}
          <span>{text}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1 text-neutral-500">
          <span className="whitespace-nowrap">Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">{currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;