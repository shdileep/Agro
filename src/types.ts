
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
