
export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
}

export enum SensorStatus {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface IrrigationLog {
  id: string;
  timestamp: string;
  type: 'Automatic' | 'Manual';
  waterQuantity: number;
  duration: number; // minutes
  soilMoisture: number;
  status?: 'Completed' | 'Cancelled';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success';
}

export type Page = 'home' | 'about' | 'schedule' | 'crop-health' | 'notifications' | 'insights' | 'weather' | 'history';

export interface WeatherData {
  currentTemp: number;
  condition: string;
  forecast: { day: string; temp: number; icon: string }[];
}

export interface TelemetryRecord {
  timestamp: number;
  moisture: number;
  temperature: number;
  humidity: number;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface DeviceStatus {
  online: boolean;
  lastHeartbeat: string;
  firmwareVersion: string;
  relayActive: boolean;
}

export interface SoilCalibrationProfile {
  dryRawAdc: number;
  wetRawAdc: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'alluvial';
  lastCalibratedAt: string;
}

export interface SystemHealthReport {
  cpuUsagePct: number;
  freeMemoryBytes: number;
  wifiRssi: number;
  uptimeSeconds: number;
}


