export interface WebSocketMessage {
  type: 'sensor_data' | 'connection_status' | 'control_update' | 'settings_update' | 'ppm_calibration';
  data: any;
  timestamp: string;
  zoneId?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionStatusCallback: ((status: 'connected' | 'connecting' | 'disconnected') => void) | null = null;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.updateConnectionStatus('connecting');
        
        // For demo purposes, we'll simulate a WebSocket connection
        // In production, replace with actual WebSocket URL
        this.simulateWebSocketConnection();
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private simulateWebSocketConnection() {
    // Simulate connection establishment
    setTimeout(() => {
      this.updateConnectionStatus('connected');
      this.reconnectAttempts = 0;
      this.startDataSimulation();
    }, 1000 + Math.random() * 2000);
  }

  private startDataSimulation() {
    // Simulate real-time sensor data updates
    const sendSensorData = () => {
      const zones = ['zone-a', 'zone-b'];
      
      zones.forEach(zoneId => {
        const sensorData = this.generateRealtimeSensorData(zoneId);
        this.handleMessage({
          type: 'sensor_data',
          data: sensorData,
          timestamp: new Date().toISOString(),
          zoneId
        });
      });
    };

    // Send initial data
    sendSensorData();

    // Set up regular updates (every 2-5 seconds for realistic variation)
    const updateInterval = setInterval(() => {
      if (this.connectionStatusCallback) {
        // Randomly simulate connection issues (5% chance)
        if (Math.random() < 0.05) {
          this.simulateConnectionIssue();
          return;
        }
        
        sendSensorData();
      }
    }, 2000 + Math.random() * 3000);

    // Store interval for cleanup
    (this as any).updateInterval = updateInterval;
  }

  private generateRealtimeSensorData(zoneId: string) {
    const baseTemp = zoneId === 'zone-a' ? 24 : 26;
    const baseHumidity = zoneId === 'zone-a' ? 65 : 70;
    const baseCO2 = zoneId === 'zone-a' ? 800 : 900;
    const baseLight = zoneId === 'zone-a' ? 5000 : 6000;
    const baseMoisture = zoneId === 'zone-a' ? 55 : 60;

    // Add realistic variations
    const tempVariation = (Math.random() - 0.5) * 4;
    const humidityVariation = (Math.random() - 0.5) * 20;
    const co2Variation = (Math.random() - 0.5) * 400;
    const lightVariation = (Math.random() - 0.5) * 2000;
    const moistureVariation = (Math.random() - 0.5) * 30;

    const temperature = Math.max(15, Math.min(40, baseTemp + tempVariation));
    const humidity = Math.max(20, Math.min(95, baseHumidity + humidityVariation));
    const co2 = Math.max(300, Math.min(2000, baseCO2 + co2Variation));
    const light = Math.max(1000, Math.min(12000, baseLight + lightVariation));
    const moisture = Math.max(10, Math.min(90, baseMoisture + moistureVariation));

    const getStatus = (value: number, normal: [number, number]) => {
      if (value >= normal[0] && value <= normal[1]) return 'normal';
      if (value < normal[0] - (normal[0] * 0.2) || value > normal[1] + (normal[1] * 0.2)) return 'critical';
      return 'warning';
    };

    return {
      id: zoneId,
      name: zoneId === 'zone-a' ? 'Zone A' : 'Zone B',
      temperature: {
        value: Math.round(temperature * 10) / 10,
        unit: '°C',
        timestamp: new Date(),
        status: getStatus(temperature, [22, 28]),
      },
      humidity: {
        value: Math.round(humidity),
        unit: '%',
        timestamp: new Date(),
        status: getStatus(humidity, [60, 80]),
      },
      co2: {
        value: Math.round(co2),
        unit: 'PPM',
        timestamp: new Date(),
        status: getStatus(co2, [600, 1200]),
        type: 'CO2',
      },
      light: {
        value: Math.round(light),
        unit: 'lux',
        timestamp: new Date(),
        status: getStatus(light, [3000, 8000]),
      },
      moisture: {
        value: Math.round(moisture),
        unit: '%',
        timestamp: new Date(),
        status: getStatus(moisture, [40, 70]),
      },
      tanks: [
        {
          id: `tank-${zoneId}1`,
          name: `Nutrient ${zoneId === 'zone-a' ? 'A' : 'B'}`,
          currentLevel: Math.round((Math.random() * 45 + 5) * 10) / 10,
          maxCapacity: 50,
          unit: 'L' as const,
          percentage: Math.round(Math.random() * 90 + 10),
        },
      ],
    };
  }

  private simulateConnectionIssue() {
    this.updateConnectionStatus('connecting');
    
    // Simulate reconnection after 3-8 seconds
    setTimeout(() => {
      if (Math.random() < 0.8) { // 80% success rate
        this.updateConnectionStatus('connected');
      } else {
        this.updateConnectionStatus('disconnected');
        // Try to reconnect after a delay
        setTimeout(() => {
          this.simulateWebSocketConnection();
        }, 5000);
      }
    }, 3000 + Math.random() * 5000);
  }

  private handleMessage(message: WebSocketMessage) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  private updateConnectionStatus(status: 'connected' | 'connecting' | 'disconnected') {
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(status);
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  onConnectionStatusChange(callback: (status: 'connected' | 'connecting' | 'disconnected') => void) {
    this.connectionStatusCallback = callback;
  }

  sendMessage(message: WebSocketMessage) {
    // In a real implementation, this would send via WebSocket
    console.log('Sending message:', message);
    
    // Simulate server response for control updates
    if (message.type === 'control_update') {
      setTimeout(() => {
        this.handleMessage({
          type: 'control_update',
          data: { success: true, ...message.data },
          timestamp: new Date().toISOString()
        });
      }, 500);
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    if ((this as any).updateInterval) {
      clearInterval((this as any).updateInterval);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.updateConnectionStatus('disconnected');
  }
}

// Singleton instance
export const websocketService = new WebSocketService({
  url: process.env.NODE_ENV === 'production' 
    ? 'wss://your-greenhouse-api.com/ws' 
    : 'ws://localhost:8080/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10
});