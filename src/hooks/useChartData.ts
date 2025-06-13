import { useState, useEffect, useCallback } from 'react';
import { GreenhouseZone } from '../types';

interface DataPoint {
  timestamp: Date;
  value: number;
}

interface ChartDataState {
  temperature: DataPoint[];
  humidity: DataPoint[];
  co2: DataPoint[];
  light: DataPoint[];
}

const MAX_DATA_POINTS = 50; // Keep last 50 data points for performance

export const useChartData = (zones: GreenhouseZone[]) => {
  const [chartData, setChartData] = useState<Record<string, ChartDataState>>({});

  const addDataPoint = useCallback((zoneId: string, zone: GreenhouseZone) => {
    setChartData(prevData => {
      const zoneData = prevData[zoneId] || {
        temperature: [],
        humidity: [],
        co2: [],
        light: []
      };

      const newZoneData = {
        temperature: [
          ...zoneData.temperature,
          { timestamp: zone.temperature.timestamp, value: zone.temperature.value }
        ].slice(-MAX_DATA_POINTS),
        humidity: [
          ...zoneData.humidity,
          { timestamp: zone.humidity.timestamp, value: zone.humidity.value }
        ].slice(-MAX_DATA_POINTS),
        co2: [
          ...zoneData.co2,
          { timestamp: zone.co2.timestamp, value: zone.co2.value }
        ].slice(-MAX_DATA_POINTS),
        light: [
          ...zoneData.light,
          { timestamp: zone.light.timestamp, value: zone.light.value }
        ].slice(-MAX_DATA_POINTS)
      };

      return {
        ...prevData,
        [zoneId]: newZoneData
      };
    });
  }, []);

  useEffect(() => {
    zones.forEach(zone => {
      addDataPoint(zone.id, zone);
    });
  }, [zones, addDataPoint]);

  return chartData;
};