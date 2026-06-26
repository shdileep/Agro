
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="p-8 bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden relative shadow-2xl shadow-green-200 rounded-3xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tighter mb-4 text-white drop-shadow-md">About AGRO Intelligence</h2>
          <p className="text-green-50 font-medium leading-relaxed max-w-xl text-lg opacity-95">
            AGRO is a next-generation smart watering system designed for modern precision agriculture.
            By leveraging real-time sensor fusion and predictive analytics, AGRO ensures your sugarcane
            crops receive the perfect amount of water, exactly when they need it. It conserves up to 40% of water
            compared to traditional methods by adjusting schedules based on soil moisture and live weather data.
          </p>
        </div>
        <i className="fa-solid fa-wheat-awn absolute -bottom-10 -right-10 text-[12rem] opacity-10 text-white"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="floating-card p-6 bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
              <i className="fa-solid fa-microchip text-xl"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Sensor Fusion</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed font-bold">
            Our hardware monitors 3 critical parameters: Soil Moisture, Temperature, and Humidity.
            This data is processed every second to detect deficits before they harm crop health.
          </p>
        </div>

        <div className="floating-card p-6 bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-lg shadow-orange-100">
              <i className="fa-solid fa-robot text-xl"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">AGRO Automation</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed font-bold">
            Powered by a <span className="text-orange-600">Pre-Trained Sugarcane Model</span> trained on real-time datasets.
            When activated, it automatically schedules watering cycles based on specific phase requirements (Sprouting, Tillering, Elongation)
            and soil drying conditions. "Recall Mind" logic ensures no water is wasted, adapting to every environmental shift instantly.
          </p>
        </div>
      </div>

      <div className="floating-card p-8 border-2 border-green-50 bg-white shadow-xl shadow-slate-100">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
          <i className="fa-solid fa-calendar-check text-green-600"></i>
          How Automation Works
        </h3>
        <ul className="space-y-6">
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center text-sm font-black shadow-md">1</div>
            <div>
              <p className="font-bold text-slate-800 text-base mb-1">Real-time Analysis</p>
              <p className="text-sm text-slate-500 font-medium">The system checks sensor thresholds every 4 seconds. If moisture drops below 30% or temperature spikes, a precise water cycle is calculated.</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center text-sm font-black shadow-md">2</div>
            <div>
              <p className="font-bold text-slate-800 text-base mb-1">Automatic Execution</p>
              <p className="text-sm text-slate-500 font-medium">Water is scheduled based on the current sugarcane growth phase (Sprouting, Tillering, Elongation) without requiring a single click.</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center text-sm font-black shadow-md">3</div>
            <div>
              <p className="font-bold text-slate-800 text-base mb-1">Water Conservation</p>
              <p className="text-sm text-slate-500 font-medium">By using AI to predict rain and evaporation rates, AGRO prevents over-watering, saving vital resources and cost.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Smart Water Scheduling Section */}
      <div className="p-6 bg-gradient-to-br from-[#052e16] via-[#022c22] to-black text-white rounded-3xl shadow-xl shadow-green-900/20 border border-green-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <i className="fa-solid fa-faucet-drip text-white"></i>
          </div>
          <h3 className="font-black text-lg tracking-wide uppercase">Smart Water Scheduling</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          AGRO moves beyond simple timers. We use a dynamic scheduling algorithm that adapts to the environment.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <i className="fa-solid fa-cloud-rain text-blue-400 text-2xl mb-2"></i>
            <h4 className="font-bold text-sm mb-1">Rain Delay</h4>
            <p className="text-xs text-slate-400">Skips cycles if rain is forecast, preventing waterlogging.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <i className="fa-solid fa-sun text-amber-400 text-2xl mb-2"></i>
            <h4 className="font-bold text-sm mb-1">Evaporation Fix</h4>
            <p className="text-xs text-slate-400">Increases volume during high heat to compensate for loss.</p>
          </div>
        </div>
      </div>

      {/* Happy Farmers Impact Section */}
      <div className="relative overflow-hidden rounded-3xl bg-green-50 p-8 border border-green-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <h3 className="text-2xl font-black text-slate-800 mb-6 relative z-10 text-center">Happy Farmers, Better Yields</h3>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
            <img src="https://images.unsplash.com/photo-1595268686273-05b1c572f77e?auto=format&fit=crop&q=80&w=200&h=200" alt="Farmer" className="w-14 h-14 rounded-full object-cover border-2 border-green-100" />
            <div>
              <p className="text-xs font-bold text-slate-800 italic mb-1">"AGRO cut my water bill by 30% and my sugarcane is taller than ever. The automation just works."</p>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">- Rajesh Kumar, Thanjavur</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
            <img src="https://images.unsplash.com/photo-1627920769848-648c6f966270?auto=format&fit=crop&q=80&w=200&h=200" alt="Farmer" className="w-14 h-14 rounded-full object-cover border-2 border-green-100" />
            <div>
              <p className="text-xs font-bold text-slate-800 italic mb-1">"I used to worry about watering during power cuts. Now AGRO manages the schedule perfectly."</p>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">- Lakshmi Devi, Madurai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Golden Shine Border */}
      <div className="relative p-[2px] rounded-3xl overflow-hidden mt-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] animate-shimmer"></div>
        <div className="bg-slate-900 relative rounded-[22px] p-6 text-center">
          <h4 className="text-white font-bold text-lg tracking-wide mb-1">Agro App powered by</h4>
          <div className="text-[#FFD700] font-black uppercase tracking-[0.1em] text-sm mb-1">Harshita Reddy</div>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-4">REG 21MIS1102</p>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>

          <div className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-chalkboard-user text-green-400"></i>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Guide: <span className="text-white">Dr. GANESH N</span></span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
