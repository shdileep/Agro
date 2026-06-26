
import React, { useState, useRef, useEffect } from 'react';
import { getAgroAIResponse, generateAgroSpeech, playPCM } from '../services/geminiService';
import { Page } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const LANGUAGES = [
  { code: 'en-US', name: 'English', label: 'English' },
  { code: 'ta-IN', name: 'Tamil', label: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', label: 'తెలుగు' },
  { code: 'hi-IN', name: 'Hindi', label: 'हिंदी' },
  { code: 'ml-IN', name: 'Malayalam', label: 'മലയാളം' }
];

interface AgroAIOverlayProps {
  onNavigate?: (page: Page) => void;
}

const AgroAIOverlay: React.FC<AgroAIOverlayProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Namaste! I am your Farmer Expert. I can help with water schedules, crop health, or weather insights. How can I assist you?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // recognitionRef.current.lang will be set dynamically
    }
  }, []);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();

    // Navigation Commands
    if (onNavigate) {
      if (lowerText.includes('open schedule') || lowerText.includes('schedule page')) {
        onNavigate('schedule');
        return true;
      }
      if (lowerText.includes('open dashboard') || lowerText.includes('home page')) {
        onNavigate('home');
        return true;
      }
      if (lowerText.includes('open weather') || lowerText.includes('check weather')) {
        onNavigate('weather');
        return true;
      }
      if (lowerText.includes('open insights') || lowerText.includes('show reports')) {
        onNavigate('insights');
        return true;
      }
      if (lowerText.includes('open history') || lowerText.includes('show logs')) {
        onNavigate('history');
        return true;
      }
      if (lowerText.includes('open notifications') || lowerText.includes('show alerts')) {
        onNavigate('notifications');
        return true;
      }
    }
    return false;
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    // Check for commands first
    if (processVoiceCommand(textToSend)) {
      setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
      setMessages(prev => [...prev, { role: 'assistant', text: `Navigating to ${textToSend.replace('open', '').trim()}...` }]);
      setInputValue('');
      return;
    }

    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    // Pass just the language code (e.g., 'ta') to the backend service if it expects 2-letter codes
    const langCode = language.split('-')[0];
    const response = await getAgroAIResponse(textToSend, langCode);

    setMessages(prev => [...prev, { role: 'assistant', text: response || 'I am having trouble connecting. Please check your internet.' }]);
    setIsLoading(false);
  };

  const handleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.lang = language;
    recognitionRef.current.start();
    setIsListening(true);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  const handleTTS = async (text: string) => {
    const langCode = language.split('-')[0];
    const audio = await generateAgroSpeech(text, langCode);
    if (audio) await playPCM(audio);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center text-white z-40 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white"
      >
        <i className="fa-solid fa-person-digging text-2xl"></i>
        <span className="absolute -top-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-72 md:w-80 h-[480px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.25)] z-50 flex flex-col border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 px-6 py-5 flex justify-between items-center border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-900/40">
            <i className="fa-solid fa-person-digging text-lg"></i>
          </div>
          <div>
            <span className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-1 text-left">Farmer Help</span>
            <span className="block text-xs font-black text-white tracking-widest uppercase leading-none">Agro Expert</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors bg-white/10 rounded-full">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between border-b border-slate-100">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-[9px] font-black text-green-600 uppercase outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      {/* Field Background Themed Chat Box */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] font-bold leading-relaxed shadow-md border ${m.role === 'user'
                ? 'bg-green-600 text-white border-green-600 rounded-tr-none'
                : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
              }`}>
              {m.text}
              {m.role === 'assistant' && (
                <button
                  onClick={() => handleTTS(m.text)}
                  className="flex items-center gap-1.5 mt-3 text-[9px] font-black text-green-600 uppercase hover:text-green-800"
                >
                  <i className="fa-solid fa-volume-high"></i> Play Audio
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 items-center">
        <button
          onClick={handleVoice}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-100 animate-pulse' : 'bg-white text-slate-400 border border-slate-200 hover:border-green-300'
            }`}
        >
          <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-base`}></i>
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask about your field..."}
            disabled={isListening}
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-green-100 outline-none placeholder-slate-400 shadow-sm transition-all disabled:bg-slate-50"
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isLoading}
          className="w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center disabled:opacity-20 transition-all active:scale-95"
        >
          <i className="fa-solid fa-paper-plane text-base"></i>
        </button>
      </div>
    </div>
  );
};

export default AgroAIOverlay;
