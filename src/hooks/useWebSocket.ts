import { useEffect, useCallback } from 'react';
import { websocketService, WebSocketMessage } from '../services/websocket';
import { useStore } from '../store';

export const useWebSocket = () => {
  const {
    setZones,
    setConnectionStatus,
    setLastUpdated,
    zones,
    controls,
    settings
  } = useStore();

  const handleSensorData = useCallback((message: WebSocketMessage) => {
    const { data, zoneId } = message;
    
    setZones(currentZones => {
      const existingZoneIndex = currentZones.findIndex(zone => zone.id === zoneId);
      
      if (existingZoneIndex >= 0) {
        // Update existing zone
        const updatedZones = [...currentZones];
        updatedZones[existingZoneIndex] = data;
        return updatedZones;
      } else {
        // Add new zone
        return [...currentZones, data];
      }
    });
    
    setLastUpdated(new Date());
  }, [setZones, setLastUpdated]);

  const handleConnectionStatus = useCallback((status: 'connected' | 'connecting' | 'disconnected') => {
    setConnectionStatus(status);
  }, [setConnectionStatus]);

  const sendControlUpdate = useCallback((controlIndex: number, newState: string) => {
    const message: WebSocketMessage = {
      type: 'control_update',
      data: {
        controlIndex,
        state: newState,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    websocketService.sendMessage(message);
  }, []);

  const sendSettingsUpdate = useCallback((newSettings: any) => {
    const message: WebSocketMessage = {
      type: 'settings_update',
      data: newSettings,
      timestamp: new Date().toISOString()
    };
    
    websocketService.sendMessage(message);
  }, []);

  const sendPPMCalibration = useCallback((calibrationData: any) => {
    const message: WebSocketMessage = {
      type: 'ppm_calibration',
      data: calibrationData,
      timestamp: new Date().toISOString()
    };
    
    websocketService.sendMessage(message);
  }, []);

  useEffect(() => {
    // Set up message handlers
    websocketService.onMessage('sensor_data', handleSensorData);
    websocketService.onConnectionStatusChange(handleConnectionStatus);

    // Connect to WebSocket
    websocketService.connect().catch(error => {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus('disconnected');
    });

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [handleSensorData, handleConnectionStatus, setConnectionStatus]);

  return {
    sendControlUpdate,
    sendSettingsUpdate,
    sendPPMCalibration,
    isConnected: websocketService !== null
  };
};