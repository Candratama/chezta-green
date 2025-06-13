import React from 'react';
import { format } from 'date-fns';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface StatusHeaderProps {
  connected: 'connected' | 'connecting' | 'disconnected';
  lastUpdated: Date;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({ connected, lastUpdated }) => {
  const connectionStatusMap = {
    connected: { 
      text: 'Connected', 
      icon: <Wifi className="w-4 h-4 text-primary-500" />, 
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    connecting: { 
      text: 'Connecting', 
      icon: <Wifi className="w-4 h-4 text-amber-500 animate-pulse" />, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    disconnected: { 
      text: 'Disconnected', 
      icon: <WifiOff className="w-4 h-4 text-red-500" />, 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  };

  const { text, icon, color, bgColor, borderColor } = connectionStatusMap[connected];
  const currentTime = format(new Date(), 'HH:mm:ss');
  const currentDate = format(new Date(), 'dd MMM yyyy');
  
  // Calculate time since last update
  const timeSinceUpdate = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
  const isStale = timeSinceUpdate > 30; // Consider data stale after 30 seconds
  
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
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                connected === 'connected' ? 'bg-primary-400' :
                connected === 'connecting' ? 'bg-amber-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className="text-xs text-neutral-500">Live</span>
            </div>
          </div>
          <p className="text-sm text-neutral-500 truncate">Smart Greenhouse Monitoring</p>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col items-center sm:flex-row sm:justify-between text-sm gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${bgColor} ${borderColor} ${color}`}>
          {icon}
          <span className="font-medium">{text}</span>
          {connected === 'connecting' && (
            <div className="flex gap-1 ml-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1 text-neutral-500">
          <div className="flex items-center gap-1">
            {isStale && <AlertCircle className="w-3 h-3 text-amber-500" />}
            <span className="whitespace-nowrap">
              Last updated: {format(lastUpdated, 'HH:mm:ss')}
              {timeSinceUpdate > 0 && (
                <span className={`ml-1 text-xs ${isStale ? 'text-amber-600' : 'text-neutral-400'}`}>
                  ({timeSinceUpdate}s ago)
                </span>
              )}
            </span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap seven-segment">{currentDate}</span>
        </div>
      </div>
      
      {connected === 'disconnected' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Connection Lost</span>
          </div>
          <p className="text-xs text-red-600 mt-1">
            Attempting to reconnect to greenhouse sensors. Some features may be unavailable.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusHeader;