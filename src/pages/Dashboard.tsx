
import React from 'react';
import { SensorData, SensorStatus } from '../types';
import { MOISTURE_THRESHOLDS, TEMP_THRESHOLDS, HUMIDITY_THRESHOLDS } from '../constants';
import SensorCard from '../components/SensorCard';

interface DashboardProps {
  sensors: SensorData;
  getStatus: (val: number, thresholds: any) => SensorStatus;
  isPumpOn: boolean;
  isControlOn: boolean;
  setIsControlOn: (v: boolean) => void;
  togglePump: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sensors, getStatus, isPumpOn, isControlOn, setIsControlOn, togglePump }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SensorCard
          label="Soil Moisture"
          value={Math.round(sensors.soilMoisture)}
          unit="%"
          status={getStatus(sensors.soilMoisture, MOISTURE_THRESHOLDS)}
          icon="fa-solid fa-water"
          colorClass="bg-blue-600"
        />
        <SensorCard
          label="Temperature"
          value={sensors.temperature.toFixed(1)}
          unit="°C"
          status={getStatus(sensors.temperature, TEMP_THRESHOLDS)}
          icon="fa-solid fa-sun-plant-wilt"
          colorClass="bg-orange-500"
        />
        <SensorCard
          label="Humidity"
          value={Math.round(sensors.humidity)}
          unit="%"
          status={getStatus(sensors.humidity, HUMIDITY_THRESHOLDS)}
          icon="fa-solid fa-cloud-showers-water"
          colorClass="bg-teal-500"
        />
      </div>

      <div className="floating-card p-6 border border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <i className="fa-solid fa-stethoscope"></i>
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Predictive Crop Health</h3>
          </div>

          {/* Logic for Status */}
          {(() => {
            const { soilMoisture, temperature, humidity } = sensors;
            let status = { text: 'Optimal Growth', color: 'text-green-600', bg: 'bg-green-100' };

            if (temperature > 35 && soilMoisture < 30) {
              status = { text: 'Water Stress Risk', color: 'text-red-600', bg: 'bg-red-100' };
            } else if (humidity > 80 && temperature > 30) {
              status = { text: 'Fungal Risk (Red Rot)', color: 'text-orange-600', bg: 'bg-orange-100' };
            } else if (soilMoisture > 90) {
              status = { text: 'Root Rot Risk', color: 'text-blue-600', bg: 'bg-blue-100' };
            }

            return (
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${status.bg} ${status.color}`}>
                {status.text}
              </span>
            );
          })()}
        </div>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          AI Analysis based on real-time sensor fusion. Monitoring for thermal stress, fungal conditions, and saturation levels.
        </p>
      </div>

      <div className="floating-card p-6 flex items-center justify-between bg-gradient-to-r from-white to-orange-50/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
            <i className="fa-solid fa-sun text-3xl"></i>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Sunrise & Sunset</h3>
            <p className="text-xs text-slate-400 font-bold uppercase">Tamil Nadu, India</p>
          </div>
        </div>
        <div className="text-right flex gap-6">
          <div className="px-3 py-1 border-r border-slate-100">
            <span className="block text-[10px] text-slate-400 uppercase font-black">Rise</span>
            <span className="text-sm font-black text-slate-800">06:05 AM</span>
          </div>
          <div className="px-3 py-1">
            <span className="block text-[10px] text-slate-400 uppercase font-black">Set</span>
            <span className="text-sm font-black text-slate-800">06:22 PM</span>
          </div>
        </div>
      </div>

      <div className="floating-card p-6 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isPumpOn ? 'bg-green-600 text-white shadow-xl shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>
            <i className={`fa-solid fa-faucet-drip text-3xl ${isPumpOn ? 'fa-beat' : ''}`}></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Irrigation Pump</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isPumpOn ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isPumpOn ? 'text-green-600' : 'text-slate-400'}`}>
                Status: {isPumpOn ? 'Activated' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Control Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Master</span>
              <span className="font-bold text-slate-700">Control System</span>
            </div>
            <button
              onClick={() => setIsControlOn(!isControlOn)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isControlOn ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isControlOn ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Pump Toggle */}
          <div className={`flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-opacity ${!isControlOn ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</span>
              <span className="font-bold text-slate-700">Pump Power</span>
            </div>
            <button
              onClick={togglePump}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isPumpOn ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isPumpOn ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <button
            onClick={togglePump}
            disabled={!isControlOn}
            className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${isPumpOn
                ? 'bg-red-50 text-red-600 border-2 border-red-100 shadow-sm'
                : 'bg-green-600 text-white shadow-xl shadow-green-100 active:scale-95'
              } ${!isControlOn ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPumpOn ? (
              <><i className="fa-solid fa-power-off"></i> STOP PUMP</>
            ) : (
              <><i className="fa-solid fa-play"></i> START PUMP</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
