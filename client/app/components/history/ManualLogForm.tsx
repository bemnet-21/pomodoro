"use client";
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SessionLog } from './HistoryDashboard';

interface ManualLogFormProps {
  onClose: () => void;
  onSubmit: (log: Omit<SessionLog, '_id'>) => void;
}

export default function ManualLogForm({ onClose, onSubmit }: ManualLogFormProps) {
  const [taskName, setTaskName] = useState('');
  const [hours, setHours] = useState(1);
  const [mins, setMins] = useState(30);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return alert('Task name is required.');
    
    const actualDurationSeconds = (hours * 3600) + (mins * 60);
    if (actualDurationSeconds <= 0) return alert('Duration must be greater than 0.');

    const startTime = new Date(dateStr).toISOString();

    onSubmit({
      taskName: taskName.trim(),
      tags: [],
      sessionType: 'work',
      actualDurationSeconds,
      startTime
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary/5 border border-primary/20 rounded-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Missing Session
        </h4>
        <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12">
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Task Objective</label>
          <input
            type="text"
            required
            placeholder="e.g. Fixing authentication bug..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-[#111] border border-[#1F1F1F] rounded p-3 text-sm text-white focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="md:col-span-6">
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Date</label>
          <input
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full bg-[#111] border border-[#1F1F1F] rounded p-3 text-sm text-white focus:outline-none focus:border-primary/50 [scheme:dark]"
          />
        </div>

        <div className="md:col-span-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Hours</label>
            <input type="number" min="0" max="23" value={hours} onChange={(e) => setHours(parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#1F1F1F] rounded p-3 text-sm text-white focus:outline-none text-center focus:border-primary/50" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Mins</label>
            <input type="number" min="0" max="59" value={mins} onChange={(e) => setMins(parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#1F1F1F] rounded p-3 text-sm text-white focus:outline-none text-center focus:border-primary/50" />
          </div>
        </div>

        <div className="md:col-span-12 border-t border-[#1F1F1F] pt-6 flex justify-between items-center">

          <button type="submit" className="bg-primary text-black font-mono font-bold text-sm py-3 px-8 rounded hover:bg-primary/80 active:scale-95 transition-all">
            SAVE RECORD
          </button>
        </div>
      </div>
    </form>
  );
}