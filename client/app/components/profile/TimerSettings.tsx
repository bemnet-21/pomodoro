"use client";
import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import type { UserSettings } from '../../types/profile';

interface TimerSettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => Promise<void>;
  error: Error | null;
  isLoading: boolean;
}

export default function TimerSettings({ settings, onSave, error, isLoading }: TimerSettingsProps) {
  const [localSettings, setLocalSettings] = useState({
    workDuration: settings.workDuration,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
    longBreakInterval: settings.longBreakInterval,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: keyof typeof localSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      ...settings,
      ...localSettings,
    });
    setIsSaving(false);
  };

  const isChanged = JSON.stringify(localSettings) !== JSON.stringify({
    workDuration: settings.workDuration,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
    longBreakInterval: settings.longBreakInterval,
  });

  if (error) {
    return (
      <div className="bg-primary/10 border border-primary/30 p-4 rounded">
        <p className="text-sm text-primary font-medium">Failed to load settings. Please try again later.</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="bg-[#111] border border-[#1F1F1F] p-4 rounded">
        <p className="text-sm text-white font-medium">Loading settings...</p>
      </div>
    );
  }
  return (
    <section className="bg-[#111] border border-[#1F1F1F] p-6 rounded-xl">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">
            Time Architecture
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Duration Settings
          </h3>
        </div>
        {isChanged && (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-primary text-black font-mono font-bold text-[10px] uppercase px-4 py-2 rounded hover:bg-primary/80 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Apply Changes'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Work Duration */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-gray-500">Focus Session (Mins)</label>
          <div className="relative">
            <input 
              type="number" min="1" max="120"
              value={localSettings.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
              className="w-full bg-background border border-[#1F1F1F] rounded p-3 text-lg font-bold text-white text-center focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Short Break */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-gray-500">Short Break (Mins)</label>
          <div className="relative">
            <input 
              type="number" min="1" max="30"
              value={localSettings.shortBreak}
              onChange={(e) => handleChange('shortBreak', e.target.value)}
              className="w-full bg-background border border-[#1F1F1F] rounded p-3 text-lg font-bold text-[#00E676] text-center focus:outline-none focus:border-[#00E676]/50"
            />
          </div>
        </div>

        {/* Long Break */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-gray-500">Long Break (Mins)</label>
          <div className="relative">
            <input 
              type="number" min="1" max="60"
              value={localSettings.longBreak}
              onChange={(e) => handleChange('longBreak', e.target.value)}
              className="w-full bg-background border border-[#1F1F1F] rounded p-3 text-lg font-bold text-[#00E676] text-center focus:outline-none focus:border-[#00E676]/50"
            />
          </div>
        </div>
      </div>

      {/* Interval Setting */}
      <div className="mt-8 pt-6 border-t border-[#1F1F1F] flex items-center justify-between">
        <div>
          <p className="text-sm text-white font-medium">Long Break Interval</p>
          <p className="text-[10px] font-mono text-gray-500 mt-1">Trigger long break after X sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" min="2" max="10" 
            value={localSettings.longBreakInterval}
            onChange={(e) => handleChange('longBreakInterval', e.target.value)}
            className="w-32 accent-primary"
          />
          <span className="w-6 text-center font-mono font-bold text-white">
            {localSettings.longBreakInterval}
          </span>
        </div>
      </div>
    </section>
  );
}