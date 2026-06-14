"use client";
import React from 'react';
import { Settings2 } from 'lucide-react';
import type { UserSettings } from '../../types/profile';

interface AutomationSettingsProps {
  settings: UserSettings;
  onSave: (newSettings: Partial<UserSettings>) => void;
}

export default function AutomationSettings({ settings, onSave }: AutomationSettingsProps) {
  
  // Directly fires the PATCH request when toggled
  const handleToggle = (key: keyof UserSettings) => {
    onSave({ [key]: !settings[key] });
  };

  return (
    <section className="bg-[#111] border border-[#1F1F1F] p-6 rounded-xl">
      <div className="mb-6">
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">
          Behavioral UX
        </span>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" /> Automation & Audio
        </h3>
      </div>

      <div className="space-y-6">
        {/* Toggle 1 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white font-medium">Auto-Start Breaks</p>
            <p className="mt-1 max-w-full text-[10px] font-mono text-gray-500 sm:max-w-62.5">
              Automatically begin the break timer when a focus session completes.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" className="sr-only peer" 
              checked={settings.autoStartBreaks}
              onChange={() => handleToggle('autoStartBreaks')}
            />
            <div className="w-11 h-6 bg-[#1F1F1F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white font-medium">Auto-Start Focus</p>
            <p className="mt-1 max-w-full text-[10px] font-mono text-gray-500 sm:max-w-62.5">
              Automatically begin the next focus session when a break ends.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" className="sr-only peer" 
              checked={settings.autoStartWork}
              onChange={() => handleToggle('autoStartWork')}
            />
            <div className="w-11 h-6 bg-[#1F1F1F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        
      </div>
    </section>
  );
}