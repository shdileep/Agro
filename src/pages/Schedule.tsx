
import React, { useState, useMemo, useEffect } from 'react';
import { SensorData, SensorStatus } from '../types';
import { MOISTURE_THRESHOLDS, TEMP_THRESHOLDS, HUMIDITY_THRESHOLDS } from '../constants';
import SensorCard from '../components/SensorCard';
import { subscribeAgroWeather } from '../services/db'; // CHANGED: Using DB subscription

type SugarcanePhase = 'Sprouting' | 'Tillering' | 'Elongation';

interface ScheduleProps {
  sensors: SensorData;
  getStatus: (val: number, thresholds: any) => SensorStatus;
  autoMode: boolean;
  setAutoMode: (v: boolean) => void;
  activeSchedule: { remainingTime: number; totalTime: number; water: number; isPaused?: boolean; phase?: SugarcanePhase } | null;
  onCancel: () => void;
  onPauseToggle: () => void;
  onScheduleStart: (water: number, timeMins: number, phase: SugarcanePhase) => void;
  showAutoMsg?: boolean;
  isSystemOn: boolean;
  triggerSystemOn: () => void;
}

const Schedule: React.FC<ScheduleProps> = ({
  sensors, getStatus, autoMode, setAutoMode, activeSchedule, onCancel, onPauseToggle, onScheduleStart, showAutoMsg, isSystemOn, triggerSystemOn
}) => {
  const [selectedPhase, setSelectedPhase] = useState<SugarcanePhase>('Sprouting');
  const [agroWeather, setAgroWeather] = useState<any>(null); // CHANGED: State for DB weather
  const [adviceIndex, setAdviceIndex] = useState(0);
  const [isAdviceVisible, setIsAdviceVisible] = useState(true);

  useEffect(() => {
    const totalCycleTime = 8000 + 500 + 200;
    const timer = setInterval(() => {
      setIsAdviceVisible(false); // Disappear
      setTimeout(() => {
        setAdviceIndex((prev) => (prev + 1) % 2); // Change Msg
        setTimeout(() => setIsAdviceVisible(true), 200); // Reappear
      }, 500);
    }, totalCycleTime);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather from Firebase (AgroWeather Node)
  useEffect(() => {
    const unsubscribe = subscribeAgroWeather(setAgroWeather);
    return () => unsubscribe();
  }, []);

  const phaseData = useMemo(() => {
    switch (selectedPhase) {
      case 'Sprouting': return { min: 55000, max: 82000, desc: 'Germination Stage (0-30 days)', color: 'text-green-500' };
      case 'Tillering': return { min: 82000, max: 110000, desc: 'Formative Stage (1-6 months)', color: 'text-blue-500' };
      case 'Elongation': return { min: 110000, max: 138000, desc: 'Grand Growth Stage (4-8 months)', color: 'text-amber-600' };
      default: return { min: 55000, max: 82000, desc: '', color: 'text-slate-400' };
    }
  }, [selectedPhase]);

  /* --- STABILIZED LOGIC --- */
  // Snapshot buffer to prevent jittering
  const [stableSensors, setStableSensors] = useState<SensorData>(sensors);

  // Update snapshot ONLY on Mount or Phase Change
  // This effectively "pauses" the live fluctuations for the calculator
  useEffect(() => {
    setStableSensors(sensors);
  }, [selectedPhase]);

  const scheduledData = useMemo(() => {
    // Base Calculation using STABLE SENSORS
    const deficitFactor = Math.max(0, (70 - stableSensors.soilMoisture) / 70);
    let baseWater = phaseData.min + (deficitFactor * (phaseData.max - phaseData.min));

    // Dynamic Modifiers
    if (stableSensors.temperature > 30) baseWater *= 1.10;
    else if (stableSensors.temperature < 20) baseWater *= 0.90;

    if (stableSensors.humidity < 40) baseWater *= 1.05;
    else if (stableSensors.humidity > 80) baseWater *= 0.95;

    const rainCode = agroWeather?.weatherCode || 0;
    const isRaining = rainCode >= 61 && rainCode <= 99;

    let advice1 = "Conditions are stable. Standard schedule active.";
    let advice2 = "Today's atmosphere is pleasant.";
    let icon = "fa-check-circle";
    let color = "text-green-600";
    let showWarning = false;

    if (isRaining) {
      baseWater *= 0.5;
      advice1 = "Rain detected. Volume reduced by 50%.";
      advice2 = "Rainfall provides natural irrigation.";
      icon = "fa-cloud-showers-heavy";
      color = "text-blue-600";
      showWarning = true;
    } else if (stableSensors.temperature > 32 && stableSensors.soilMoisture < 30) {
      advice1 = "Critical Heat & Dryness! Volume boosted.";
      advice2 = "Emergency hydration protocols engaged.";
      icon = "fa-temperature-arrow-up";
      color = "text-red-500";
      showWarning = true;
    } else if (stableSensors.temperature > 30 || (agroWeather && agroWeather.temp > 30)) {
      if (agroWeather && agroWeather.temp > stableSensors.temperature) {
        baseWater *= 1.05;
      }
      advice1 = `High evaporation. Supply increased.`;
      advice2 = `Today's atmosphere is warm (${stableSensors.temperature}°C).`;
      icon = "fa-sun";
      color = "text-amber-500";
      showWarning = true;
    }

    const water = Math.round(baseWater);
    const timeMins = Math.round(water / 1500);
    const currentAdvice = adviceIndex === 0 ? advice1 : advice2;

    return { water, time: timeMins, currentAdvice, icon, color, showWarning, weatherCode: rainCode };
  }, [stableSensors, phaseData, agroWeather, adviceIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m} : ${s < 10 ? '0' : ''}${s}`;
  };

  // AI Schedule Optimizer Logic
  const optimization = useMemo(() => {
    // Novelty Feature: "AI Water ROI Calculator"
    // Logic: High Temp (> 30C) = High Evaporation (Poor Efficiency)
    // Optimal is < 25C (Early Morning / Evening)

    const currentTemp = sensors.temperature;
    const efficiency = Math.max(0, Math.min(100, 100 - (currentTemp - 20) * 2));

    let suggestion = '';
    let savings = 0;
    let savingsPercent = 0;

    if (currentTemp > 30) {
      suggestion = "Shift to 6:00 PM";
      savingsPercent = 15;
      savings = Math.round(scheduledData.water * 0.15);
    } else if (currentTemp > 25) {
      suggestion = "Shift to 6:00 PM";
      savingsPercent = 8;
      savings = Math.round(scheduledData.water * 0.08);
    } else {
      suggestion = "Start Now";
      savings = 0;
    }

    return { efficiency, suggestion, savings, savingsPercent };
  }, [sensors.temperature, scheduledData.water]);

  const progress = activeSchedule ? (1 - activeSchedule.remainingTime / activeSchedule.totalTime) * 100 : 0;
  const fieldLines = Array.from({ length: 8 });

  return (
    <div className="space-y-6 pb-10 relative">
      {/* 3-Second Automation Toast */}
      {showAutoMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0f172a] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2 animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
          Model Active: {selectedPhase} data loaded. "Recall Mind" optimizing...
        </div>
      )}

      {/* Sensor Monitor Header */}
      <div className="grid grid-cols-3 gap-3">
        <SensorCard label="Moisture" value={Math.round(sensors.soilMoisture)} unit="%" status={getStatus(sensors.soilMoisture, MOISTURE_THRESHOLDS)} icon="fa-solid fa-droplet" colorClass="bg-blue-600" />
        <SensorCard label="Temp" value={Math.round(sensors.temperature)} unit="°C" status={getStatus(sensors.temperature, TEMP_THRESHOLDS)} icon="fa-solid fa-temperature-full" colorClass="bg-orange-500" />
        <SensorCard label="Humidity" value={Math.round(sensors.humidity)} unit="%" status={getStatus(sensors.humidity, HUMIDITY_THRESHOLDS)} icon="fa-solid fa-wind" colorClass="bg-teal-500" />
      </div>

      {/* Auto Mode Control Card - Fixed Visibility */}
      <div className="p-4 bg-[#0f172a] text-white shadow-lg relative overflow-hidden group rounded-3xl border border-slate-900">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center text-green-400">
              <i className="fa-solid fa-robot text-lg"></i>
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight leading-none mb-1 text-white">AGRO Automation</h3>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                {autoMode ? `Pre-Trained Model: ${selectedPhase} Mode` : 'Autonomous Logic Inactive'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isSystemOn) {
                // If System OFF, blink the button to remind user
                alert("Master System is Locked (Safe Mode). Click 'Enable System' below.");
                return;
              }
              setAutoMode(!autoMode);
            }}
            className={`w-12 h-7 rounded-full p-1 transition-all duration-500 flex items-center border border-white/10 ${autoMode ? 'bg-green-600' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 ${autoMode ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'}`}></div>
          </button>
        </div>
      </div>

      {!activeSchedule ? (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-4">
          {/* Phase Selection Card */}
          <div className="floating-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-seedling text-green-600 text-xs"></i>
              <h3 className="font-black text-slate-800 text-[9px] uppercase tracking-widest">Select Sugarcane Phase</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Sprouting', 'Tillering', 'Elongation'] as SugarcanePhase[]).map(phase => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl text-[8px] font-black uppercase transition-all border ${selectedPhase === phase
                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-lg'
                    : 'bg-white text-slate-400 border-slate-100'
                    }`}
                >
                  <i className={`fa-solid ${phase === 'Sprouting' ? 'fa-seedling' : phase === 'Tillering' ? 'fa-wheat-awn' : 'fa-tree'} text-lg mb-0.5`}></i>
                  {phase}
                </button>
              ))}
            </div>
          </div>

          {/* Proposal / Activation Card */}
          <div className="floating-card p-5 border-2 border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
              </div>
              <h3 className="font-black text-slate-800 text-[9px] uppercase tracking-widest">Irrigation Proposal</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase mb-1 tracking-tighter">Stage</span>
                <span className={`text-xs font-black ${phaseData.color}`}>{selectedPhase}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-[8px] text-slate-400 font-black uppercase mb-1 tracking-tighter">Area</span>
                <span className="text-xs font-black text-slate-800 tracking-tight">1.0 Acre</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-blue-50">
                <span className="block text-[8px] text-slate-400 font-black uppercase mb-1 tracking-tighter">Volume</span>
                <span className="text-lg font-black text-blue-600 tracking-tighter">{scheduledData.water.toLocaleString()} L</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-orange-50">
                <span className="block text-[8px] text-slate-400 font-black uppercase mb-1 tracking-tighter">Time</span>
                <span className="text-lg font-black text-orange-600 tracking-tighter">{scheduledData.time} Mins</span>
              </div>
            </div>

            {/* Agro Intelligence Engine */}
            <div className={`mb-6 p-5 rounded-2xl border-2 shadow-sm transition-all duration-500 ${scheduledData.showWarning ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex justify-between items-center mb-3 border-b border-black/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <i className="fa-solid fa-robot text-slate-700 relative z-10"></i>
                    <div className="absolute inset-0 bg-blue-400 blur-sm opacity-50 animate-pulse"></div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Agro Intelligence Engine</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">LIVE</span>
                </div>
              </div>

              <div className="flex items-start gap-4 min-h-[5rem]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${scheduledData.color.replace('text', 'bg').replace('500', '100').replace('600', '100')}`}>
                  <i className={`fa-solid ${scheduledData.icon} ${scheduledData.color} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className={`transition-opacity duration-500 ${isAdviceVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      "{scheduledData.currentAdvice}"
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-black/5 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                      <span>Adjusted based on:</span>
                      <span className="text-slate-800 bg-white/50 px-1.5 rounded border border-black/5">
                        {stableSensors.temperature}°C Temp • {stableSensors.humidity}% Humidity
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                      <span>Condition:</span>
                      <span className={`text-slate-800 px-1.5 rounded flex items-center gap-1 border border-black/5 bg-white/50`}>
                        <i className={`fa-solid ${scheduledData.weatherCode >= 60 ? 'fa-cloud-rain' : 'fa-sun'} ${scheduledData.showWarning ? 'text-amber-500' : 'text-amber-500'}`}></i>
                        {agroWeather?.condition || (stableSensors.temperature > 30 ? 'Heat' : 'Sunny')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <i className="fa-solid fa-bolt text-amber-500"></i> Pump Action
                      </span>
                      <span className="text-[9px] font-black uppercase text-white bg-slate-800 px-2 py-0.5 rounded-full shadow-sm">
                        {scheduledData.showWarning && scheduledData.color.includes('red') ? 'STANDBY' : 'PUMP ON'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isSystemOn) {
                  triggerSystemOn();
                  return;
                }
                onScheduleStart(scheduledData.water, scheduledData.time, selectedPhase);
              }}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all text-sm flex items-center justify-center gap-2 ${isSystemOn
                ? 'bg-[#4caf50] text-white shadow-green-100 active:scale-95'
                : 'bg-slate-800 text-white shadow-slate-200 animate-pulse'
                }`}
            >
              {!isSystemOn && <i className="fa-solid fa-lock-open"></i>}
              {isSystemOn ? 'ACTIVATE IRRIGATION NOW' : 'TAP TO ENABLE SYSTEM'}
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE IRRIGATION: COMPACT UI FOR MOBILE */
        <div className="floating-card p-6 border-2 border-green-600 relative overflow-hidden bg-white shadow-xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                <i className="fa-solid fa-droplet text-2xl fa-beat-fade"></i>
              </div>
              <div>
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest block mb-0.5">STATUS: IRRIGATION ACTIVE</span>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Stage: {activeSchedule.phase}</h3>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="block text-3xl font-mono font-black text-slate-900 tabular-nums leading-none mb-1">
                {formatTime(activeSchedule.remainingTime)}
              </span>
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">TIME REMAINING</span>
            </div>
          </div>

          <div className="relative aspect-[2/1] bg-[#1a120f] rounded-2xl mb-6 overflow-hidden border-[6px] border-slate-900">
            <div className="absolute inset-0 flex flex-col">
              {fieldLines.map((_, i) => {
                const lineStart = i * 12.5;
                const lineEnd = (i + 1) * 12.5;
                let currentLineWidth = 0;
                if (progress >= lineEnd) currentLineWidth = 100;
                else if (progress > lineStart) currentLineWidth = ((progress - lineStart) / 12.5) * 100;

                return (
                  <div key={i} className="flex-1 relative border-b border-white/5 flex items-center justify-around px-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-500 ease-linear"
                      style={{ width: `${currentLineWidth}%` }}
                    ></div>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div key={j} className="relative z-10">
                        <i className={`fa-solid fa-seedling ${currentLineWidth > (j * 12.5) ? 'text-green-400 scale-110' : 'text-green-950/40'} text-lg`}></i>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">
                  WATERING FURROW {Math.min(8, Math.floor(progress / 12.5) + 1)} / 8
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em]">
                <i className="fa-solid fa-water text-[8px]"></i>
                RATE: 1,500 L/MIN
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-faucet-drip text-xl"></i>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-black tracking-widest leading-tight">VOLUME APPLIED</span>
                <span className="text-base font-black text-slate-800 tabular-nums">{Math.round((progress / 100) * activeSchedule.water).toLocaleString()} L</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <i className={`fa-solid ${activeSchedule.isPaused ? 'fa-circle-pause' : 'fa-spinner fa-spin'} text-xl`}></i>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-black tracking-widest leading-tight">PUMP STATE</span>
                <span className="text-base font-black text-slate-800 uppercase">{activeSchedule.isPaused ? 'PAUSED' : 'NOMINAL'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPauseToggle}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-md ${activeSchedule.isPaused ? 'bg-amber-50 text-amber-700' : 'bg-[#0f172a] text-white'
                }`}
            >
              <i className={`fa-solid ${activeSchedule.isPaused ? 'fa-play' : 'fa-pause'} mr-2 text-[10px]`}></i>
              {activeSchedule.isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] shadow-md"
            >
              <i className="fa-solid fa-circle-xmark mr-2 text-[10px]"></i>
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
