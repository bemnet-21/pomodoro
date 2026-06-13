"use client";
import { Play, Pause, RefreshCcw, Square } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewLog } from './history/HistoryDashboard';

// Define the modes and their durations in seconds
const MODES = {
  work: { label: 'FOCUS', time: 25 * 60, color: '#FF4D00', rgb: '255,77,0' },
  shortBreak: { label: 'SHORT BREAK', time: 5 * 60, color: '#00E676', rgb: '0,230,118' },
  longBreak: { label: 'LONG BREAK', time: 15 * 60, color: '#00E676', rgb: '0,230,118' },
};

type ModeKey = keyof typeof MODES;

interface CounterCardProps {
  onSessionComplete: (sessionData: NewLog) => void;
}

const CounterCard = ({ onSessionComplete }: CounterCardProps) => {
  const [mode, setMode] = useState<ModeKey>('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.time);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState(''); 
  
  const timeSpentRef = useRef(0);

  const handleModeChange = (newMode: ModeKey) => {
    if (isActive) {
      if (!confirm('Timer is running. Switch mode and lose progress?')) return;
    }
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
    timeSpentRef.current = 0;
  };
  const resetTimer = () => {
    setTimeLeft(MODES[mode].time);
    setIsActive(false);
    timeSpentRef.current = 0;
  };
  const handleComplete = useCallback((status: 'completed' | 'abandoned') => {
    const sessionType: NewLog['sessionType'] =
      mode === 'work' ? 'work' : mode === 'shortBreak' ? 'short-break' : 'long-break';

    setIsActive(false);
    
    const payload: NewLog = {
      taskName,
      sessionType,
      status,
      plannedDurationSeconds: MODES[mode].time,
      actualDurationSeconds: timeSpentRef.current,
      startTime: new Date(Date.now() - timeSpentRef.current * 1000).toISOString(),
      endTime: new Date().toISOString(),
    };

    onSessionComplete(payload);
    
    if (status === 'completed' && mode === 'work') {
      setMode('shortBreak');
      setTimeLeft(MODES.shortBreak.time);
      timeSpentRef.current = 0;
    } else {
      setTimeLeft(MODES[mode].time);
      timeSpentRef.current = 0;
    }
  }, [mode, onSessionComplete, taskName]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete('completed');
          return 0;
        }

        timeSpentRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, handleComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const currentTheme = MODES[mode];

  return (
    <div 
      className="w-[90%] md:w-[75%] max-w-3xl h-120 bg-[#111111] flex flex-col justify-between items-center rounded-2xl px-6 py-12 transition-all duration-700"
      style={{
        borderColor: `rgba(${currentTheme.rgb}, 0.3)`,
        borderWidth: '1px',
        boxShadow: isActive ? `0 0 60px rgba(${currentTheme.rgb}, 0.15)` : '0 0 0px rgba(0,0,0,0)'
      }}
    >
      <nav className="w-full md:w-[60%] flex justify-between text-gray-500 font-mono text-xs md:text-sm tracking-widest">
        {(Object.keys(MODES) as ModeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`transition-colors duration-300 pb-1 border-b-2 ${
              mode === key ? 'text-white border-current' : 'border-transparent hover:text-gray-300'
            }`}
            style={{ color: mode === key ? currentTheme.color : undefined }}
          >
            {MODES[key].label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-y-4 w-full">
        <div 
          className="text-7xl md:text-[9rem] font-bold tracking-tighter font-mono tabular-nums transition-colors duration-700"
          style={{ color: isActive ? currentTheme.color : '#FFFFFF' }}
        >
          {formatTime(timeLeft)}
        </div>
        
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          disabled={isActive}
          className="bg-transparent text-center text-gray-400 text-sm md:text-base border-b border-transparent hover:border-gray-700 focus:border-gray-500 focus:outline-none focus:text-white transition-all w-3/4 max-w-md disabled:hover:border-transparent disabled:opacity-50"
          placeholder="What are you focusing on?"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTimer}
          className="relative isolate w-fit p-6 rounded-full cursor-pointer transition-transform active:scale-95"
          style={{ backgroundColor: currentTheme.color }}
        >
          <div 
            className="absolute inset-0 -z-10 rounded-full blur-md opacity-70 transition-all duration-300"
            style={{ backgroundColor: currentTheme.color, transform: isActive ? 'scale(1.3)' : 'scale(1)' }}
          />
          {isActive ? (
            <Pause className="text-black" size={28} fill="currentColor" stroke="none" />
          ) : (
            <Play className="text-black translate-x-0.5" size={28} fill="currentColor" stroke="none" />
          )}
        </button>

        {isActive ? (
          <button
            type="button"
            onClick={() => handleComplete('abandoned')}
            aria-label="Stop early"
            className="grid size-12 place-items-center rounded-full border border-gray-700 text-gray-400 transition hover:border-red-500 hover:text-red-500 hover:bg-red-500/10"
            title="Abandon Session"
          >
            <Square size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={resetTimer}
            aria-label="Refresh timer"
            className="grid size-12 place-items-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:text-white"
          >
            <RefreshCcw size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CounterCard;