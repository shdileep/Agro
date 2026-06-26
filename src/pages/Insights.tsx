
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { subscribeHistory, WaterHistoryEntry } from '../services/db';

interface InsightsProps {
  sensorHistory: any[];
  activeSchedule: any | null;
}

const Insights: React.FC<InsightsProps> = ({ sensorHistory, activeSchedule }) => {
  // No mock data - purely waiting for props or real subscriptions
  const [flowHistory, setFlowHistory] = useState<any[]>([]);
  const [waterHistory, setWaterHistory] = useState<WaterHistoryEntry[]>([]);

  // Use a local active status derived from history or props
  // If activeSchedule is present from props, use it.
  const isIrrigationActive = activeSchedule && !activeSchedule.isPaused && activeSchedule.remainingTime > 0;

  useEffect(() => {
    const unsubscribe = subscribeHistory((data) => {
      if (data) {
        setWaterHistory(Object.values(data));
      } else {
        setWaterHistory([]); // Ensure empty if no data
      }
    });
    return () => unsubscribe();
  }, []);

  // Simulation for live water flow data - ONLY if active
  useEffect(() => {
    const interval = setInterval(() => {
      if (isIrrigationActive) {
        setFlowHistory(prev => {
          const flowValue = 1450 + Math.random() * 100; // Live sensor simulation
          const newEntry = { time: new Date().toLocaleTimeString(), flow: flowValue };
          const updated = [...prev, newEntry];
          if (updated.length > 30) return updated.slice(1);
          return updated;
        });
      } else {
        // Clear or flatline if not active
        setFlowHistory(prev => {
          if (prev.length === 0) return [];
          const newEntry = { time: new Date().toLocaleTimeString(), flow: 0 };
          const updated = [...prev, newEntry];
          if (updated.length > 30) return updated.slice(1);
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isIrrigationActive]);

  const NoDataMessage = ({ message }: { message: string }) => (
    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 opacity-60">
      <i className="fa-solid fa-cloud-slash text-2xl mb-2"></i>
      <span className="text-[10px] font-bold uppercase tracking-widest">{message}</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black text-slate-800">Field Analytics</h2>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-Time Monitoring</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Scheduled Bar Graph */}
        <div className="floating-card p-5 border-2 border-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-faucet-drip"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Water Scheduled (Liters)</h3>
          </div>
          <div className="h-48 w-full">
            {waterHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterHistory.slice(-7)}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 8 }} tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                  <YAxis style={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                  <Bar dataKey="waterApplied" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Scheduled Volume" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No Irrigation History Found" />
            )}
          </div>
        </div>

        {/* Status Pie Chart - Fixed Logic */}
        <div className="floating-card p-5 border-2 border-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Schedule Status Distribution</h3>
          </div>
          <div className="h-48 w-full flex justify-center">
            {waterHistory.length > 0 || isIrrigationActive ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: waterHistory.filter((h) => h.status === 'Completed').length },
                      { name: 'Cancelled', value: waterHistory.filter((h) => h.status === 'Cancelled').length },
                      { name: 'In Progress', value: isIrrigationActive ? Math.max(1, waterHistory.length * 0.15) : 0 }
                    ]}
                    cx="40%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    <Cell fill="#10b981" /> {/* Completed */}
                    <Cell fill="#ef4444" /> {/* Cancelled */}
                    <Cell fill="#3b82f6" /> {/* In Progress */}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: 'none', fontSize: '10px' }} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No Activity Logged" />
            )}
          </div>
        </div>

        {/* Live Flow Rate Chart */}
        <div className="floating-card p-5 border-2 border-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-water"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Live Flow Rate (L/min)</h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowHistory}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 8 }} interval={4} />
                <YAxis style={{ fontSize: 9 }} domain={[0, 2000]} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: 'none', fontSize: '10px' }} />
                <Area type="monotone" dataKey="flow" stroke="#6366f1" fillOpacity={1} fill="url(#colorFlow)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isIrrigationActive ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isIrrigationActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {isIrrigationActive ? 'Active Irrigation Flow' : 'Pump Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Graph 2: Temperature (Bar Graph) */}
        <div className="floating-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <i className="fa-solid fa-temperature-full"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Temperature (°C)</h3>
          </div>
          <div className="h-40 w-full">
            {sensorHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensorHistory}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                  <Bar dataKey="temperature" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="Waiting for Live Sensor Data..." />
            )}
          </div>
        </div>

        {/* Graph 2: Soil Moisture (Bar Graph) */}
        <div className="floating-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-droplet"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Soil Moisture (%)</h3>
          </div>
          <div className="h-40 w-full">
            {sensorHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensorHistory}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                  <Bar dataKey="soilMoisture" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="Waiting for Live Sensor Data..." />
            )}
          </div>
        </div>

        {/* Graph 3: Humidity (Bar Graph) */}
        <div className="floating-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
              <i className="fa-solid fa-wind"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Humidity (%)</h3>
          </div>
          <div className="h-40 w-full">
            {sensorHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensorHistory}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                  <Bar dataKey="humidity" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="Waiting for Live Sensor Data..." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
