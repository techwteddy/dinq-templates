'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { toast } from 'sonner';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function FocusTimer() {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = mode === 'focus' ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clear();
            setRunning(false);
            toast.success(mode === 'focus' ? 'Focus session complete! Take a break.' : 'Break over. Ready to focus?');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return () => clear();
  }, [running, mode, clear]);

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const switchMode = (m: 'focus' | 'break') => {
    setMode(m);
    setRunning(false);
    setTimeLeft(m === 'focus' ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const saveSession = async () => {
    if (timeLeft === totalSeconds) return;
    const elapsed = totalSeconds - timeLeft;
    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration_seconds: elapsed,
          started_at: new Date(Date.now() - elapsed * 1000).toISOString(),
          label: label || mode,
        }),
      });
      toast.success('Session saved!');
    } catch {
      toast.error('Failed to save session');
    }
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            mode === 'focus' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            mode === 'break' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Break
        </button>
      </div>

      <div className="relative w-64 h-64 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'focus' ? '#16a34a' : '#f59e0b'}
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-slate-900 tracking-tight">
            {mins}:{secs}
          </span>
          <span className="text-xs text-slate-400 mt-1">{running ? 'Running' : 'Paused'}</span>
        </div>
      </div>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="What are you working on?"
        className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-brand-500"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg transition active:scale-95 ${
            running ? 'bg-slate-800' : mode === 'focus' ? 'bg-brand-600' : 'bg-amber-500'
          }`}
        >
          {running ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={saveSession}
          disabled={timeLeft === totalSeconds}
          className="h-10 px-4 rounded-full bg-slate-900 text-white text-xs font-medium flex items-center gap-2 transition active:scale-95 disabled:opacity-40"
        >
          <Coffee className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
}
