"use client";
import { Play, Pause, RefreshCcw, Square } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { NewLog } from './history/HistoryDashboard';
import ConfirmModal from './ui/ConfirmModal';

const MODE_THEME = {
  work: { label: 'FOCUS', color: '#FF4D00', rgb: '255,77,0' },
  shortBreak: { label: 'SHORT BREAK', color: '#00E676', rgb: '0,230,118' },
  longBreak: { label: 'LONG BREAK', color: '#00E676', rgb: '0,230,118' },
};

type ModeKey = keyof typeof MODE_THEME;

interface CounterCardProps {
  onSessionComplete: (sessionData: NewLog) => void;
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  longBreakInterval: number;
}

const CounterCard = ({ onSessionComplete, durations, longBreakInterval }: CounterCardProps) => {
  const modes = useMemo(() => ({
    work: { ...MODE_THEME.work, time: durations.work * 60 },
    shortBreak: { ...MODE_THEME.shortBreak, time: durations.shortBreak * 60 },
    longBreak: { ...MODE_THEME.longBreak, time: durations.longBreak * 60 },
  }), [durations.longBreak, durations.shortBreak, durations.work]);

  const [mode, setMode] = useState<ModeKey>('work');
  const [timeLeft, setTimeLeft] = useState(modes.work.time);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState(''); 
  const [taskNameError, setTaskNameError] = useState('');
  const [completedFocusCount, setCompletedFocusCount] = useState(0);
  const [pendingModeChange, setPendingModeChange] = useState<ModeKey | null>(null);
  
  const timeSpentRef = useRef(0);
  const timeLeftRef = useRef(modes.work.time);
  const isCompletingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const updateTimeLeft = useCallback((seconds: number) => {
    timeLeftRef.current = seconds;
    setTimeLeft(seconds);
  }, []);

  const ensureAudioContext = useCallback(async () => {
    if (typeof window === 'undefined') return null;

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }

    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch {
        return null;
      }
    }

    return audioContextRef.current;
  }, []);

  const playAlarm = useCallback(async () => {
    const context = await ensureAudioContext();
    if (!context) return;

    const startTime = context.currentTime;
    [0, 0.22, 0.44].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(index % 2 === 0 ? 880 : 660, startTime + offset);

      gain.gain.setValueAtTime(0.0001, startTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + 0.18);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + 0.2);
    });
  }, [ensureAudioContext]);

  const applyModeChange = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    updateTimeLeft(modes[newMode].time);
    setIsActive(false);
    timeSpentRef.current = 0;
    isCompletingRef.current = false;
  }, [modes, updateTimeLeft]);

  const handleModeChange = (newMode: ModeKey) => {
    if (isActive) {
      setPendingModeChange(newMode);
      return;
    }

    applyModeChange(newMode);
  };
  const resetTimer = () => {
    updateTimeLeft(modes[mode].time);
    setIsActive(false);
    timeSpentRef.current = 0;
    isCompletingRef.current = false;
  };
  const handleComplete = useCallback((status: 'completed' | 'abandoned') => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    const sessionType: NewLog['sessionType'] =
      mode === 'work' ? 'work' : mode === 'shortBreak' ? 'short-break' : 'long-break';

    setIsActive(false);
    void playAlarm();

    const safeActualDuration = Math.max(1, Math.floor(timeSpentRef.current));
    
    const payload: NewLog = {
      taskName,
      sessionType,
      status,
      plannedDurationSeconds: modes[mode].time,
      actualDurationSeconds: safeActualDuration,
      startTime: new Date(Date.now() - safeActualDuration * 1000).toISOString(),
      endTime: new Date().toISOString(),
    };

    onSessionComplete(payload);
    
    if (status === 'completed' && mode === 'work') {
      const nextFocusCount = completedFocusCount + 1;
      setCompletedFocusCount(nextFocusCount);

      const safeInterval = Math.max(1, Math.floor(longBreakInterval));
      const shouldTakeLongBreak = nextFocusCount % safeInterval === 0;
      const nextBreakMode: ModeKey = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';

      setMode(nextBreakMode);
      updateTimeLeft(modes[nextBreakMode].time);
      timeSpentRef.current = 0;
    } else if (status === 'completed' && (mode === 'shortBreak' || mode === 'longBreak')) {
      setMode('work');
      updateTimeLeft(modes.work.time);
      timeSpentRef.current = 0;
    } else {
      updateTimeLeft(modes[mode].time);
      timeSpentRef.current = 0;
    }
    isCompletingRef.current = false;
  }, [completedFocusCount, longBreakInterval, mode, modes, onSessionComplete, playAlarm, taskName, updateTimeLeft]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        clearInterval(interval);
        updateTimeLeft(0);
        handleComplete('completed');
        return;
      }

      timeSpentRef.current += 1;
      updateTimeLeft(timeLeftRef.current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, handleComplete, updateTimeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  

  const toggleTimer = () => {
    if (!isActive && !taskName.trim()) {
      setTaskNameError('Task name is required before starting a session.');
      return;
    }

    if (taskNameError) {
      setTaskNameError('');
    }

    if (!isActive) {
      void ensureAudioContext();
    }

    setIsActive(!isActive);
  };

  const currentTheme = modes[mode];

  return (
    <>
      <ConfirmModal
        open={Boolean(pendingModeChange)}
        title="Switch Mode"
        message="Timer is running. Switch mode and lose current progress?"
        confirmText="Switch"
        cancelText="Stay"
        onConfirm={() => {
          if (!pendingModeChange) return;
          applyModeChange(pendingModeChange);
          setPendingModeChange(null);
        }}
        onCancel={() => setPendingModeChange(null)}
      />

      <div 
        className="w-[90%] md:w-[75%] max-w-3xl h-120 bg-[#111111] flex flex-col justify-between items-center rounded-2xl px-6 py-12 transition-all duration-700"
        style={{
          borderColor: `rgba(${currentTheme.rgb}, 0.3)`,
          borderWidth: '1px',
          boxShadow: isActive ? `0 0 60px rgba(${currentTheme.rgb}, 0.15)` : '0 0 0px rgba(0,0,0,0)'
        }}
      >
        <nav className="w-full md:w-[60%] flex justify-between text-gray-500 font-mono text-xs md:text-sm tracking-widest">
        {(Object.keys(modes) as ModeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`transition-colors duration-300 pb-1 border-b-2 ${
              mode === key ? 'text-white border-current' : 'border-transparent hover:text-gray-300'
            }`}
            style={{ color: mode === key ? currentTheme.color : undefined }}
          >
            {modes[key].label}
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
          onChange={(e) => {
            setTaskName(e.target.value);
            if (taskNameError && e.target.value.trim()) {
              setTaskNameError('');
            }
          }}
          disabled={isActive}
          className="bg-transparent text-center text-gray-400 text-sm md:text-base border-b border-transparent hover:border-gray-700 focus:border-gray-500 focus:outline-none focus:text-white transition-all w-3/4 max-w-md disabled:hover:border-transparent disabled:opacity-50"
          placeholder="What are you focusing on?"
        />
        {taskNameError && (
          <p className="text-xs font-mono text-red-400 tracking-wide">{taskNameError}</p>
        )}
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
    </>
  );
};

export default CounterCard;