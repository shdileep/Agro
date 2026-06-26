
import React, { useState, useEffect, useCallback } from 'react';
import { SensorData, SensorStatus, Page, Notification, IrrigationLog } from './types';
import { MOISTURE_THRESHOLDS, TEMP_THRESHOLDS, HUMIDITY_THRESHOLDS } from './constants';
import NavigationDrawer from './components/NavigationDrawer';
import AgroAIOverlay from './components/AgroAIOverlay';
import { subscribeReadings, addHistoryEntry } from './services/db';

// Pages
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import NotificationsPage from './pages/NotificationsPage';
import Insights from './pages/Insights';
import History from './pages/History';
import AgroWeather from './pages/Weather';
import About from './pages/About';
import CropHealth from './pages/CropHealth';

const SplashScreen: React.FC = () => (
  <div className="splash-container">
    <div className="field-icons opacity-10 absolute top-20 text-white text-9xl flex gap-20">
      <i className="fa-solid fa-wheat-awn"></i>
      <i className="fa-solid fa-seedling"></i>
      <i className="fa-solid fa-cloud-sun"></i>
      <i className="fa-solid fa-wheat-awn"></i>
      <i className="fa-solid fa-seedling"></i>
      <i className="fa-solid fa-cloud-sun"></i>
    </div>

    <div className="relative group">
      <div className="agro-text scale-110">AGRO</div>
      <p className="text-white font-black tracking-[0.5em] text-xs mt-4 opacity-50 uppercase text-center w-full">Precision Agriculture</p>
    </div>

    <div className="field-animation mt-20 overflow-hidden w-full relative">
      <div className="flex gap-4 p-4 items-end justify-center">
        <div className="w-1 bg-white/20 h-12 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 bg-white/20 h-24 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 bg-white/20 h-16 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 bg-white/20 h-32 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isPumpOn, setIsPumpOn] = useState(false);
  /* --- MASTER CONTROL DEFAULT: ON (Always Online) --- */
  const [isControlOn, setIsControlOn] = useState(true);

  const [autoMode, setAutoMode] = useState(false);
  const [autoModeMsg, setAutoModeMsg] = useState(false);

  /* --- LOAMY SOIL PHYSICS ENGINE --- */
  const [sensors, setSensors] = useState<SensorData>({
    soilMoisture: 38, // Start in the requested 30-40% range
    temperature: 31,
    humidity: 55
  });

  const [sensorHistory, setSensorHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Boot', message: 'AGRO Core initialized. System Online.', timestamp: new Date().toLocaleTimeString(), type: 'info' }
  ]);

  const [history, setHistory] = useState<IrrigationLog[]>([]);

  const [activeSchedule, setActiveSchedule] = useState<{
    remainingTime: number;
    totalTime: number;
    water: number;
    isPaused?: boolean;
    phase?: any;
    type?: 'Automatic' | 'Manual';
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getStatus = useCallback((val: number, thresholds: { low: number, high: number }) => {
    if (val < thresholds.low) return SensorStatus.LOW;
    if (val > thresholds.high) return SensorStatus.HIGH;
    return SensorStatus.MEDIUM;
  }, []);

  /* --- PHYSICS SIMULATION LOOP --- */
  useEffect(() => {
    const physicsInterval = setInterval(() => {
      setSensors(prev => {
        let { soilMoisture, humidity, temperature } = prev;

        if (isPumpOn) {
          // 1. IRRIGATION PHASE: Rapid Rise (Saturation)
          // Target: Saturation > 90%
          if (soilMoisture < 70) {
            soilMoisture += 0.8; // Fast rise to wet
          } else if (soilMoisture < 95) {
            soilMoisture += 0.3; // Slower saturation peak
          }

          // Humidity Spike (Sprinkler Effect)
          if (humidity < 85) humidity += 0.5;

          // Temp Cooldown
          if (temperature > 24) temperature -= 0.1;

        } else {
          // 2. DRYING PHASE (Decay)

          // A. Gravitational Drainage (Saturation -> Field Capacity)
          // Drains quickly from Wet (>70%) down to Field Capacity
          if (soilMoisture > 70) {
            soilMoisture -= 0.4;
          }
          // B. Evapotranspiration (Field Capacity -> Optimal Range 30-50%)
          else if (soilMoisture > 50) {
            soilMoisture -= 0.1;
          }
          // C. Optimal Maintenance (30-50%) - Very slow loss
          // User requested maintenance in 30-40% range specifically
          else if (soilMoisture > 40) {
            soilMoisture -= 0.05;
          }
          else if (soilMoisture > 30) {
            // EXTREMELY SLOW DECAY to maintain 30-35% for a long time
            // Only decays if temp is very high
            if (temperature > 35) soilMoisture -= 0.02;
            else soilMoisture -= 0.005;
          }
          // D. Dry Stress (< 30%)
          else if (soilMoisture > 5) {
            soilMoisture -= 0.02;
          }

          // Humidity Equilibruim (returns to ambient ~45-55%)
          if (humidity > 55) humidity -= 0.2;
          else if (humidity < 45) humidity += 0.1;

          // Temp Normalization (returns to ambient ~32)
          if (temperature < 32) temperature += 0.05;
        }

        return {
          soilMoisture: parseFloat(soilMoisture.toFixed(2)),
          humidity: parseFloat(humidity.toFixed(2)),
          temperature: parseFloat(temperature.toFixed(2))
        };
      });
    }, 200); // 5 updates per second for smooth animation

    return () => clearInterval(physicsInterval);
  }, [isPumpOn]);

  /* --- SENSOR HISTORY LOGGER (1Hz) --- */
  /* --- SENSOR HISTORY LOGGER (1Hz) --- */
  // Use Ref to hold latest sensor data without triggering effect re-runs
  const sensorsRef = React.useRef(sensors);
  useEffect(() => { sensorsRef.current = sensors; }, [sensors]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setSensorHistory(prev => {
        const newEntry = {
          soilMoisture: sensorsRef.current.soilMoisture,
          temperature: sensorsRef.current.temperature,
          humidity: sensorsRef.current.humidity,
          time: new Date().toLocaleTimeString()
        };
        const updated = [...prev, newEntry];
        return updated.length > 20 ? updated.slice(1) : updated;
      });

      // AUTO MODE TRIGGER CHECK
      // "without multiple schedule when became drying"
      if (autoMode && isControlOn && !activeSchedule && !isPumpOn) {
        // Trigger ONLY if Field Capacity is lost (< 20%)
        if (sensorsRef.current.soilMoisture < 20) {
          addNotification('Agro Automation', 'Soil Low (<20%). Precision Cycle Started.', 'success');
          handleScheduleStart(35000, 25, 'Tillering', 'Automatic');
        }
      }

    }, 1000); // 1Hz Logger
    return () => clearInterval(logInterval);
  }, []); // Empty dependency array = Persistent Interval

  const handleToggleAutoMode = (val: boolean) => {
    setAutoMode(val);
    if (val) {
      setAutoModeMsg(true);
      setTimeout(() => setAutoModeMsg(false), 3000);
      addNotification('AGRO Automation Enabled', 'System will now handle irrigation for 30 days.', 'info');

      if (!activeSchedule && !isPumpOn && isControlOn) {
        const water = 64596;
        const durationMins = 43;
        handleScheduleStart(water, durationMins, 'Sprouting', 'Automatic');
      }
    } else {
      if (activeSchedule && activeSchedule.type === 'Automatic') {
        handleCancelSchedule();
      }
    }
  };

  useEffect(() => {
    if (activeSchedule && !activeSchedule.isPaused) {
      const timer = setInterval(() => {
        setActiveSchedule(prev => {
          if (!prev) return null;
          if (prev.remainingTime <= 0) {
            handleCycleFinish(prev.water, Math.round(prev.totalTime / 60), 'Completed', prev.type || 'Manual');
            return null;
          }
          return { ...prev, remainingTime: prev.remainingTime - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeSchedule]);

  const handleCycleFinish = (water: number, duration: number, status: 'Completed' | 'Cancelled', type: 'Automatic' | 'Manual') => {
    setIsPumpOn(false);
    addNotification(status === 'Completed' ? 'Irrigation Finished' : 'Irrigation Cancelled',
      `${status === 'Completed' ? 'Completed' : 'Partial'} ${water}L cycle. Automatically logged to history.`,
      status === 'Completed' ? 'success' : 'alert');

    const newHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      waterQuantity: water,
      duration,
      soilMoisture: sensors.soilMoisture,
      status
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    // Push to Firebase for Insights
    addHistoryEntry({
      mode: type,
      status,
      timestamp: new Date().toISOString(),
      waterApplied: water,
      duration,
      moisture: sensors.soilMoisture,
      area: 250 // Default area for now
    });
  };

  const handleCancelSchedule = () => {
    if (activeSchedule) {
      const partialWater = Math.round((1 - activeSchedule.remainingTime / activeSchedule.totalTime) * activeSchedule.water);
      const partialDuration = Math.round((activeSchedule.totalTime - activeSchedule.remainingTime) / 60);
      handleCycleFinish(partialWater, partialDuration, 'Cancelled', activeSchedule.type || 'Manual');
      setActiveSchedule(null);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handlePauseToggle = () => {
    if (activeSchedule) {
      const nextPausedState = !activeSchedule.isPaused;
      setActiveSchedule({ ...activeSchedule, isPaused: nextPausedState });
      setIsPumpOn(!nextPausedState);
    }
  };

  const handleScheduleStart = (water: number, timeMins: number, phase: any, type: 'Automatic' | 'Manual' = 'Manual') => {
    if (!isControlOn) return;
    setActiveSchedule({ remainingTime: timeMins * 60, totalTime: timeMins * 60, water, phase, isPaused: false, type });
    setIsPumpOn(true);
    addNotification('Irrigation Started', `Scheduled ${water}L cycle. Monitoring active.`, 'info');
  };

  const addNotification = (title: string, message: string, type: 'info' | 'alert' | 'success') => {
    setNotifications(prev => [{ id: Date.now().toString(), title, message, timestamp: new Date().toLocaleTimeString(), type }, ...prev]);
  };

  const togglePump = () => {
    if (!isControlOn) return;
    if (isPumpOn) {
      if (activeSchedule) {
        handleCancelSchedule();
      } else {
        setIsPumpOn(false);
      }
    } else {
      setIsPumpOn(true);
      addNotification('Manual Override', 'Pump started manually.', 'info');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Dashboard sensors={sensors} getStatus={getStatus} isPumpOn={isPumpOn} isControlOn={isControlOn} setIsControlOn={setIsControlOn} togglePump={togglePump} />;
      case 'about': return <About />;
      case 'schedule': return <Schedule
        sensors={sensors}
        getStatus={getStatus}
        autoMode={autoMode}
        setAutoMode={handleToggleAutoMode}
        activeSchedule={activeSchedule}
        onCancel={handleCancelSchedule}
        onPauseToggle={handlePauseToggle}
        onScheduleStart={(water, time, phase) => handleScheduleStart(water, time, phase, 'Manual')}
        showAutoMsg={autoModeMsg}
        isSystemOn={isControlOn}
        triggerSystemOn={() => setIsControlOn(true)}
      />

      case 'crop-health': return <CropHealth sensors={sensors} isPumpOn={isPumpOn} phase={activeSchedule?.phase || 'Sprouting'} />;
      case 'notifications': return <NotificationsPage notifications={notifications} />;
      case 'insights': return <Insights sensorHistory={sensorHistory} activeSchedule={activeSchedule} />;
      case 'weather': return (
        <AgroWeather
          onScheduleAction={(water, time) => handleScheduleStart(water, time, 'Smart Weather', 'Automatic')}
          onAddNotification={addNotification}
        />
      );
      case 'history': return <History logs={history} onDelete={handleDeleteHistoryItem} />;
      default: return null;
    }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30 px-6 h-16 flex items-center justify-between border-b border-slate-100">
        <button onClick={() => setIsDrawerOpen(true)} className="w-12 h-12 flex items-center justify-center text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
          <i className="fa-solid fa-bars-staggered text-2xl"></i>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-green-200">A</div>
          <span className="font-black text-xl text-slate-800 tracking-tighter">AGRO</span>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
          <i className="fa-solid fa-user-gear text-slate-400"></i>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {renderPage()}
      </main>

      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} currentPage={currentPage} onPageChange={setCurrentPage} />
      <AgroAIOverlay onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
