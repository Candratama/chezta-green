import { GreenhouseZone } from '../types';

// Generate a random value within a range
const randomValue = (min: number, max: number, decimals = 0): number => {
  const value = Math.random() * (max - min) + min;
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

// Generate random status based on value and thresholds
const getStatus = (value: number, normal: [number, number]): 'normal' | 'warning' | 'critical' => {
  if (value >= normal[0] && value <= normal[1]) {
    return 'normal';
  } else if (value < normal[0] - (normal[0] * 0.2) || value > normal[1] + (normal[1] * 0.2)) {
    return 'critical';
  } else {
    return 'warning';
  }
};

// Generate mock data for greenhouse zones
export const generateMockZoneData = (): GreenhouseZone[] => {
  const currentTime = new Date();
  
  return [
    {
      id: 'zone-a',
      name: 'Zone A',
      temperature: {
        value: randomValue(20, 35, 1),
        unit: '°C',
        timestamp: currentTime,
        status: getStatus(randomValue(20, 35, 1), [22, 28]),
      },
      humidity: {
        value: randomValue(40, 90),
        unit: '%',
        timestamp: currentTime,
        status: getStatus(randomValue(40, 90), [60, 80]),
      },
      co2: {
        value: randomValue(400, 1500),
        unit: 'PPM',
        timestamp: currentTime,
        status: getStatus(randomValue(400, 1500), [600, 1200]),
        type: 'CO2',
      },
      light: {
        value: randomValue(2000, 10000),
        unit: 'lux',
        timestamp: currentTime,
        status: getStatus(randomValue(2000, 10000), [3000, 8000]),
      },
      moisture: {
        value: randomValue(20, 90),
        unit: '%',
        timestamp: currentTime,
        status: getStatus(randomValue(20, 90), [40, 70]),
      },
      tanks: [
        {
          id: 'tank-a1',
          name: 'Nutrient A',
          currentLevel: randomValue(5, 50),
          maxCapacity: 50,
          unit: 'L',
          percentage: randomValue(10, 100),
        },
      ],
    },
    {
      id: 'zone-b',
      name: 'Zone B',
      temperature: {
        value: randomValue(20, 35, 1),
        unit: '°C',
        timestamp: currentTime,
        status: getStatus(randomValue(20, 35, 1), [22, 28]),
      },
      humidity: {
        value: randomValue(40, 90),
        unit: '%',
        timestamp: currentTime,
        status: getStatus(randomValue(40, 90), [60, 80]),
      },
      co2: {
        value: randomValue(400, 1500),
        unit: 'PPM',
        timestamp: currentTime,
        status: getStatus(randomValue(400, 1500), [600, 1200]),
        type: 'CO2',
      },
      light: {
        value: randomValue(2000, 10000),
        unit: 'lux',
        timestamp: currentTime,
        status: getStatus(randomValue(2000, 10000), [3000, 8000]),
      },
      moisture: {
        value: randomValue(20, 90),
        unit: '%',
        timestamp: currentTime,
        status: getStatus(randomValue(20, 90), [40, 70]),
      },
      tanks: [
        {
          id: 'tank-b1',
          name: 'Nutrient B',
          currentLevel: randomValue(5, 50),
          maxCapacity: 50,
          unit: 'L',
          percentage: randomValue(10, 100),
        },
      ],
    },
  ];
};

// Get current connection status (simulated)
export const getConnectionStatus = (): 'connected' | 'connecting' | 'disconnected' => {
  const statuses = ['connected', 'connecting', 'disconnected'] as const;
  const randomIndex = Math.floor(Math.random() * 10);
  
  // 80% chance of being connected
  if (randomIndex < 8) {
    return 'connected';
  } else if (randomIndex < 9) {
    return 'connecting';
  } else {
    return 'disconnected';
  }
};