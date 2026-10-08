import { TelemetryRecord } from '../types';

/**
 * Convert telemetry records into formatted CSV string
 */
export const convertTelemetryToCSV = (records: TelemetryRecord[]): string => {
  const headers = ['Timestamp', 'Date', 'Moisture (%)', 'Temperature (°C)', 'Humidity (%)', 'Battery (%)', 'Signal'];
  const rows = records.map((r) => [
    r.timestamp,
    new Date(r.timestamp).toISOString(),
    r.moisture,
    r.temperature,
    r.humidity,
    r.batteryLevel ?? 'N/A',
    r.signalStrength ?? 'N/A',
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};

/**
 * Trigger browser file download for exported data
 */
export const downloadCSV = (csvContent: string, filename = 'agro_telemetry_export.csv'): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
