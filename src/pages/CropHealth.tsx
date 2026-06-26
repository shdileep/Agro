
import React, { useEffect, useState } from 'react';
import { SensorData } from '../types';

interface CropHealthProps {
    sensors: SensorData;
    isPumpOn: boolean;
    phase: 'Sprouting' | 'Tillering' | 'Elongation';
}

const LivePrediction = ({ sensors }: { sensors: SensorData }) => {
    const [msgIndex, setMsgIndex] = useState(0);

    const messages = [
        `Soil Moisture is ${sensors.soilMoisture > 60 ? 'Optimal' : 'Low'}. Root absorption ${sensors.soilMoisture > 60 ? 'High' : 'Limited'}.`,
        `Termperature ${sensors.temperature}°C. Photosynthesis efficiency ${sensors.temperature < 35 ? 'Peak' : 'Reduced'}.`,
        "Micro-nutrient uptake predicted to increase by 5% in next hour.",
        "Root zone aeration levels stable. Fungal risk analysis running..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="p-4 bg-slate-800 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col justify-between">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Insight
            </h4>
            <div key={msgIndex} className="text-[11px] font-bold text-slate-200 leading-tight animate-fade-in">
                {messages[msgIndex]}
            </div>
            <div className="w-full bg-slate-700 h-0.5 mt-2 rounded-full">
                <div className="h-full bg-emerald-500 animate-[width_4s_linear] w-full origin-left"></div>
            </div>
            <style>{`
                @keyframes width { from { width: 0%; } to { width: 100%; } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

const CropHealth: React.FC<CropHealthProps> = ({ sensors, isPumpOn, phase }) => {
    const [growthRate, setGrowthRate] = useState(0);
    const [healthStatus, setHealthStatus] = useState('Excellent');
    const [windActive, setWindActive] = useState(false);

    // --- 1. Intelligence Engine (Metabolic Rate) ---
    useEffect(() => {
        // Metabolic Score Calculation
        let score = 0;
        if (sensors.temperature >= 24 && sensors.temperature <= 32) score += 35;
        else if (sensors.temperature > 15 && sensors.temperature < 40) score += 15;

        if (sensors.soilMoisture >= 40 && sensors.soilMoisture <= 80) score += 35;
        else if (sensors.soilMoisture > 20) score += 10;

        if (sensors.humidity >= 50 && sensors.humidity <= 80) score += 30;
        else score += 10;

        if (sensors.temperature > 38) score -= 40;
        if (sensors.soilMoisture < 20) score -= 30;
        if (sensors.soilMoisture > 95) score -= 30;

        setGrowthRate(Math.max(0, Math.min(100, score)));

        if (score > 80) setHealthStatus('Vigorous Growth');
        else if (score > 50) setHealthStatus('Stable');
        else if (score > 20) setHealthStatus('Stressed');
        else setHealthStatus('Critical');

    }, [sensors]);

    // --- 2. Wind Animation Timer ---
    useEffect(() => {
        const interval = setInterval(() => {
            setWindActive(true);
            setTimeout(() => setWindActive(false), 2000); // Wind blows for 2s
        }, 5000); // Every 5 seconds total cycle (3s pause + 2s blow)
        return () => clearInterval(interval);
    }, []);

    // --- 3. Dynamic Visuals ---
    const soilLightness = Math.max(25, 80 - (sensors.soilMoisture * 0.55));
    const soilColor = `hsl(25, 35%, ${soilLightness}%)`;

    // --- RENDERERS FOR DIFFERENT PHASES ---

    const renderSprouting = () => (
        <g transform="translate(100, 350)"> {/* Relative to soil surface */}
            {/* Horizontal Seed Piece (Sett) */}
            <rect x="-30" y="-8" width="60" height="16" rx="2" fill="#8d6e63" stroke="#5d4037" strokeWidth="1" />
            <line x1="-10" y1="-8" x2="-10" y2="8" stroke="#5d4037" strokeWidth="2" />
            <line x1="10" y1="-8" x2="10" y2="8" stroke="#5d4037" strokeWidth="2" />

            {/* Small Green Shoots (Top) */}
            <path d="M-10,-8 Q-15,-25 -25,-30" stroke="#84cc16" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M-10,-8 Q-5,-35 5,-40" stroke="#65a30d" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M10,-8 Q20,-30 30,-35" stroke="#84cc16" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Roots (Bottom) */}
            <g opacity="0.8">
                <path d="M-20,8 Q-25,30 -35,40" stroke="#e7e5e4" strokeWidth="2" fill="none" />
                <path d="M0,8 Q5,35 0,50" stroke="#e7e5e4" strokeWidth="2" fill="none" />
                <path d="M20,8 Q25,30 35,40" stroke="#e7e5e4" strokeWidth="2" fill="none" />
                <path d="M-10,20 L-15,25" stroke="#e7e5e4" strokeWidth="1" />
                <path d="M10,25 L15,30" stroke="#e7e5e4" strokeWidth="1" />
            </g>
        </g>
    );

    const renderTillering = () => (
        <g transform="translate(100, 350)">
            {/* Roots System (Deeper) */}
            <g opacity="0.7">
                <path d="M0,0 Q-15,40 -30,60" stroke="#e7e5e4" strokeWidth="2" fill="none" />
                <path d="M0,0 Q15,40 30,60" stroke="#e7e5e4" strokeWidth="2" fill="none" />
                <path d="M0,0 L0,70" stroke="#e7e5e4" strokeWidth="2" fill="none" />
            </g>

            {/* Medium Green Stalk - Segmented */}
            {/* Segment 1 */}
            <rect x="-6" y="-30" width="12" height="30" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />
            <rect x="-6" y="-30" width="12" height="2" fill="#bef264" opacity="0.5" />
            {/* Segment 2 */}
            <rect x="-6" y="-60" width="12" height="30" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />
            <rect x="-6" y="-60" width="12" height="2" fill="#bef264" opacity="0.5" />
            {/* Segment 3 */}
            <rect x="-6" y="-90" width="12" height="30" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />
            <rect x="-6" y="-90" width="12" height="2" fill="#bef264" opacity="0.5" />
            {/* Segment 4 */}
            <rect x="-6" y="-120" width="12" height="30" fill="#84cc16" stroke="#365314" strokeWidth="0.5" />

            {/* Leaves - JUST AT THE TOP */}
            <g transform="translate(0, -120)">
                {/* Left Leaf */}
                <path d="M0,0 Q-30,-20 -50,10" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />
                <path d="M0,0 Q-30,-20 -50,10" fill="none" stroke="#bef264" strokeWidth="1" opacity="0.3" />
                {/* Right Leaf */}
                <path d="M0,0 Q30,-20 50,10" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />
                <path d="M0,0 Q30,-20 50,10" fill="none" stroke="#bef264" strokeWidth="1" opacity="0.3" />
                {/* Top Shoots */}
                <path d="M0,0 Q-10,-40 0,-60" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
                <path d="M0,0 Q10,-40 0,-60" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.5" />
            </g>
        </g>
    );

    const renderElongation = () => (
        <g transform="translate(100, 350)">
            {/* Deep Root System */}
            <g opacity="0.6">
                <path d="M0,0 Q-20,60 -40,100" stroke="#e7e5e4" strokeWidth="3" fill="none" />
                <path d="M0,0 Q20,60 40,100" stroke="#e7e5e4" strokeWidth="3" fill="none" />
                <path d="M0,0 L0,110" stroke="#e7e5e4" strokeWidth="3" fill="none" />
            </g>

            {/* Tall Purple/Dark Stalk */}
            {/* Base */}
            <rect x="-8" y="-40" width="16" height="40" fill="#4c1d95" stroke="#2e1065" strokeWidth="0.5" />
            <rect x="-8" y="-40" width="16" height="2" fill="#c4b5fd" opacity="0.4" />
            {/* Seg 2 */}
            <rect x="-8" y="-80" width="16" height="40" fill="#5b21b6" stroke="#2e1065" strokeWidth="0.5" />
            <rect x="-8" y="-80" width="16" height="2" fill="#c4b5fd" opacity="0.4" />
            {/* Seg 3 */}
            <rect x="-8" y="-120" width="16" height="40" fill="#6d28d9" stroke="#2e1065" strokeWidth="0.5" />
            <rect x="-8" y="-120" width="16" height="2" fill="#c4b5fd" opacity="0.4" />
            {/* Seg 4 */}
            <rect x="-8" y="-160" width="16" height="40" fill="#7c3aed" stroke="#2e1065" strokeWidth="0.5" />
            <rect x="-8" y="-160" width="16" height="2" fill="#c4b5fd" opacity="0.4" />
            {/* Seg 5 */}
            <rect x="-8" y="-200" width="16" height="40" fill="#8b5cf6" stroke="#2e1065" strokeWidth="0.5" />

            {/* Top Heavy Foliage - NO MIDDLE LEAVES */}
            <g transform="translate(0, -200)">
                {/* Lower Top Leaves */}
                <path d="M0,0 Q-40,-10 -70,30" fill="#15803d" />
                <path d="M0,0 Q40,-10 70,30" fill="#15803d" />
                {/* Mid Top Leaves */}
                <path d="M0,-10 Q-30,-50 -60,-20" fill="#16a34a" />
                <path d="M0,-10 Q30,-50 60,-20" fill="#16a34a" />
                {/* Upper Top Leaves */}
                <path d="M0,-20 Q-15,-70 -5,-90" fill="#22c55e" />
                <path d="M0,-20 Q15,-70 5,-90" fill="#4ade80" />
                {/* Central Spike */}
                <path d="M0,-20 L0,-100" stroke="#86efac" strokeWidth="4" />
            </g>
        </g>
    );

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">AGRO Live Crop Health</h2>
                </div>
                <div className={`px-4 py-2 rounded-xl border-2 ${growthRate > 60 ? 'border-green-100 bg-green-50 text-green-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-center">Metabolic Rate</div>
                    <div className="text-2xl font-black text-center">{Math.round(growthRate)}%</div>
                </div>
            </div>

            {/* --- MAIN DIGITAL TWIN VISUALIZER --- */}
            <div className="relative h-[450px] w-full rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white flex flex-col">

                {/* SKY SECTION (Top 65%) */}
                <div className="h-[65%] w-full bg-gradient-to-b from-sky-300 via-sky-100 to-white relative overflow-hidden">

                    {/* 1. Live Sun Widget (Top Right) */}
                    <div className="absolute top-6 right-6 z-20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg flex items-center justify-center relative z-10 border-4 border-yellow-100/50">
                                <span className="text-xs font-black text-yellow-900">{Math.round(sensors.temperature)}°C</span>
                            </div>
                            <svg className="absolute -inset-4 w-24 h-24 animate-spin-slow text-yellow-400 opacity-60" viewBox="0 0 100 100">
                                <path d="M50 0 L55 10 L50 20 L45 10 Z" fill="currentColor" />
                                <path d="M50 100 L55 90 L50 80 L45 90 Z" fill="currentColor" />
                                <path d="M100 50 L90 55 L80 50 L90 45 Z" fill="currentColor" />
                                <path d="M0 50 L10 55 L20 50 L10 45 Z" fill="currentColor" />
                                <path d="M85.3 14.6 L78 22 L70 14 L78 7 Z" fill="currentColor" transform="rotate(45 50 50)" />
                                <path d="M14.6 85.3 L22 78 L14 70 L7 78 Z" fill="currentColor" transform="rotate(45 50 50)" />
                                <path d="M85.3 85.3 L78 78 L70 85 L78 93 Z" fill="currentColor" transform="rotate(-45 50 50)" />
                                <path d="M14.6 14.6 L22 22 L14 30 L7 22 Z" fill="currentColor" transform="rotate(-45 50 50)" />
                            </svg>
                        </div>
                    </div>

                    {/* 2. Air Flow (Wind) Animation */}
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${windActive ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Wind Lines */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path d="M-100,50 Q100,80 300,40 T600,60" stroke="white" strokeWidth="2" fill="none" className="animate-wind-slow" style={{ opacity: 0.4 }} />
                            <path d="M-100,100 Q150,90 400,120" stroke="white" strokeWidth="3" fill="none" className="animate-wind-fast" style={{ opacity: 0.6 }} />
                            <path d="M-100,150 Q200,180 500,140" stroke="white" strokeWidth="1" fill="none" className="animate-wind-medium" style={{ opacity: 0.3 }} />
                        </svg>
                        <div className="absolute top-1/2 left-10 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-sky-700">
                            Humidity: {sensors.humidity}%
                        </div>
                    </div>

                </div>

                {/* SOIL SECTION (Bottom 35%) */}
                <div
                    className="h-[35%] w-full relative transition-colors duration-2000 ease-in-out border-t-4 border-[#5d4037]/20"
                    style={{ backgroundColor: soilColor }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>

                    {/* CENTRAL SVG CONTAINER */}
                    {/* FIXED: Adjusted margin and height to ground the plant */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 z-10 overflow-visible" style={{ height: '500px', marginTop: '-350px' }}>
                        <svg width="200" height="400" viewBox="0 0 200 400" className="overflow-visible">
                            {phase === 'Sprouting' && renderSprouting()}
                            {phase === 'Tillering' && renderTillering()}
                            {phase === 'Elongation' && renderElongation()}
                        </svg>
                    </div>

                    {/* 5. FLOOD IRRIGATION WATER ANIMATION */}
                    <div className="absolute top-0 left-0 h-4 w-full bg-blue-500/0 overflow-hidden z-20">
                        {isPumpOn && (
                            <div className="h-full bg-blue-500/60 animate-flood rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        )}
                    </div>

                    {/* Subsurface Moisture Saturation Visual */}
                    {isPumpOn && (
                        <div className="absolute inset-0 bg-blue-900/10 animate-saturate origin-top"></div>
                    )}

                    {/* Soil Info Tag */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-2">
                        <i className="fa-solid fa-droplet text-blue-400"></i>
                        ({phase}) Moisture: {sensors.soilMoisture}%
                    </div>
                </div>
            </div>

            {/* --- FIELD PARAMETERS SECTION --- */}
            <div className="pt-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 pl-2 opacity-80">Field Analyzers</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                    {/* 1. SOIL TYPE CARD - DYNAMIC WETNESS */}
                    <div
                        className="p-4 rounded-3xl border relative overflow-hidden flex flex-col justify-center transition-colors duration-2000 ease-in-out"
                        style={{
                            backgroundColor: soilColor,
                            borderColor: sensors.soilMoisture > 50 ? 'rgba(93, 64, 55, 0.4)' : '#e7e5e4'
                        }}
                    >
                        <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${sensors.soilMoisture > 60 ? 'text-white/60' : 'text-stone-400'}`}>Soil Profile</h4>
                        <div className={`text-lg font-black ${sensors.soilMoisture > 60 ? 'text-white' : 'text-stone-800'}`}>
                            {sensors.soilMoisture > 80 ? 'Saturated Loam' : sensors.soilMoisture > 40 ? 'Moist Loam' : 'Loam'}
                        </div>

                        {/* Wetness Texture Overlay */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20">
                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse mix-blend-overlay"></div>
                        </div>

                        <div className="flex gap-1 mt-2">
                            <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
                                <div className={`h-full w-[85%] ${sensors.soilMoisture > 60 ? 'bg-white/80' : 'bg-stone-500'}`}></div>
                            </div>
                        </div>
                        <p className={`text-[9px] mt-1 font-bold ${sensors.soilMoisture > 60 ? 'text-white/70' : 'text-stone-500'}`}>
                            {sensors.soilMoisture > 80 ? 'High Retention' : 'Optimum Fertility'}
                        </p>
                    </div>

                    {/* 2. AREA CARD */}
                    <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 relative overflow-hidden flex flex-col justify-center">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Field Area</h4>
                        <div className="text-lg font-black text-slate-800">1 Acre</div>
                        <div className="text-[10px] font-bold text-slate-400">0.405 Hectare</div>
                        <i className="fa-solid fa-vector-square absolute -bottom-2 -right-2 text-4xl text-indigo-200/50 transform rotate-12"></i>
                    </div>

                    {/* 3. IRRIGATION STATUS CARD */}
                    <div className={`p-4 rounded-3xl border relative overflow-hidden flex flex-col justify-center transition-colors duration-500 ${isPumpOn ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isPumpOn ? 'text-blue-200' : 'text-slate-400'}`}>Irrigation Mode</h4>
                        {isPumpOn ? (
                            <>
                                <div className="text-md font-black flex items-center gap-2">
                                    Flood System <i className="fa-solid fa-check-circle text-blue-300"></i>
                                </div>
                                <div className="text-[10px] font-bold text-blue-100 flex items-center gap-1 mt-1 animate-pulse">
                                    <i className="fa-solid fa-water"></i> Active Flow
                                </div>
                                {/* Mini Flow Overlay */}
                                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-blue-400/30 overflow-hidden">
                                    <div className="h-full w-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-wind-fast"></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-md font-black text-slate-800">Standby</div>
                                <div className="text-[10px] font-bold text-slate-400 mt-1">Scheduled</div>
                            </>
                        )}
                    </div>

                    {/* 4. LIVE PREDICTION (AI Insight) */}
                    <LivePrediction sensors={sensors} />
                </div>
            </div>

            {/* --- CROP METRICS SECTION --- */}
            <div className="pt-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 pl-2 opacity-80">Crop Intel</h3>
                <div className="grid grid-cols-2 gap-4">

                    {/* Phase Card */}
                    <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Active Phase</h4>
                        <div className="text-lg font-black text-slate-800 relative z-10">{phase}</div>
                        <div className="mt-4 flex gap-1">
                            <div className={`h-1.5 flex-1 rounded-full ${phase === 'Sprouting' ? 'bg-green-500' : 'bg-green-100'}`}></div>
                            <div className={`h-1.5 flex-1 rounded-full ${phase === 'Tillering' ? 'bg-green-500' : 'bg-green-100'}`}></div>
                            <div className={`h-1.5 flex-1 rounded-full ${phase === 'Elongation' ? 'bg-green-500' : 'bg-green-100'}`}></div>
                        </div>
                    </div>

                    {/* Pest Risk */}
                    <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pest Risk</h4>
                            <div className="text-xs font-bold text-slate-700 leading-tight">
                                {phase === 'Sprouting' ? 'Termites/Shoot Borer Risk: Low' :
                                    phase === 'Tillering' ? 'Top Borer Risk: Moderate' :
                                        'Red Rot Conditions Detected'}
                            </div>
                        </div>
                        <div className="flex justify-end mt-2">
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                <i className="fa-solid fa-bug text-sm"></i>
                            </div>
                        </div>
                    </div>

                    {/* Carbon Capture */}
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 shadow-sm">
                        <h4 className="text-xs font-black text-emerald-600/60 uppercase tracking-widest mb-1">Carbon Capture</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-800">12.4</span>
                            <span className="text-[10px] font-bold text-slate-400">kg CO₂</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[65%] animate-pulse"></div>
                        </div>
                        <p className="text-[9px] text-emerald-600 mt-2 font-bold flex items-center gap-1">
                            <i className="fa-solid fa-leaf"></i> Generating Credits
                        </p>
                    </div>

                    {/* Microbiome */}
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-3xl border border-amber-100 shadow-sm">
                        <h4 className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-1">Microbiome</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-800">Active</span>
                        </div>
                        <div className="flex -space-x-1 mt-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] text-blue-600 font-black">N</div>
                            <div className="w-5 h-5 rounded-full bg-purple-100 border border-white flex items-center justify-center text-[8px] text-purple-600 font-black">P</div>
                            <div className="w-5 h-5 rounded-full bg-orange-100 border border-white flex items-center justify-center text-[8px] text-orange-600 font-black">K</div>
                        </div>
                        <p className="text-[9px] text-amber-600 mt-2 font-bold flex items-center gap-1">
                            <i className="fa-solid fa-bacterium"></i> Bio-Rich
                        </p>
                    </div>

                </div>
            </div>

            <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes wind-slide { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        .animate-wind-slow { animation: wind-slide 3s linear forwards; }
        .animate-wind-fast { animation: wind-slide 1.5s linear forwards; }
        .animate-wind-medium { animation: wind-slide 2.2s linear forwards; }
        @keyframes flood { 0% { width: 0%; opacity: 0.8; } 100% { width: 100%; opacity: 0.8; } }
        .animate-flood { animation: flood 3s ease-out forwards; }
        @keyframes saturate { 0% { opacity: 0; transform: scaleY(0); } 100% { opacity: 1; transform: scaleY(1); } }
        .animate-saturate { animation: saturate 5s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default CropHealth;
