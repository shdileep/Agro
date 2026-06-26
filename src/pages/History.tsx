
import React from 'react';
import { IrrigationLog } from '../types';

interface HistoryProps {
  logs: IrrigationLog[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ logs, onDelete }) => {
  const handleExportPDF = () => {
    alert("Exporting Irrigation History as PDF...");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-xl font-bold text-slate-800">Irrigation History</h2>
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200"
        >
          <i className="fa-solid fa-file-pdf"></i>
          Export PDF
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="floating-card p-12 flex flex-col items-center justify-center text-center opacity-60">
          <i className="fa-solid fa-clock-rotate-left text-4xl text-slate-300 mb-3"></i>
          <p className="text-slate-500">No logs available</p>
          <p className="text-xs text-slate-400">Records will appear after irrigation cycles.</p>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log.id} className={`floating-card p-5 border-l-4 transition-all relative group ${log.status === 'Cancelled' ? 'border-red-200 opacity-80' : 'border-green-600'}`}>
            <button 
              onClick={() => onDelete(log.id)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Record"
            >
              <i className="fa-solid fa-trash-can text-sm"></i>
            </button>

            <div className="flex justify-between items-start mb-3 mr-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    log.type === 'Automatic' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {log.type} Mode
                  </span>
                  {log.status === 'Cancelled' && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-red-100 text-red-600">
                      Cancelled
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-1">{log.timestamp}</h4>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-slate-800">{log.waterQuantity.toLocaleString()}L</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Applied</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-3">
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Duration</span>
                <span className="text-xs font-semibold text-slate-700">{log.duration} Mins</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Moisture</span>
                <span className="text-xs font-semibold text-slate-700">{log.soilMoisture}%</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Area</span>
                <span className="text-xs font-semibold text-slate-700">1 Acre</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
