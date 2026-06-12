'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  id: string;
  type: 'task' | 'habit' | 'focus' | 'general';
  content: string;
  reason: string | null;
  created_at: string;
}

export default function AiInsightCard() {
  const [insights, setInsights] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/tasks'); // reuse tasks endpoint to check auth + data
      if (!res.ok) throw new Error();
      // In a full app you'd have a GET /api/ai-suggestions endpoint; simulate from localStorage for demo
      const stored = localStorage.getItem('focusflow_insights');
      if (stored) setInsights(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai-suggest', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        const merged = [...json.data, ...insights].slice(0, 5);
        setInsights(merged);
        localStorage.setItem('focusflow_insights', JSON.stringify(merged));
        toast.success('New insight generated');
      } else {
        toast.error(json.error || 'Failed to generate');
      }
    } catch {
      toast.error('Offline or rate limited');
    } finally {
      setGenerating(false);
    }
  };

  const dismiss = (id: string) => {
    const next = insights.filter((i) => i.id !== id);
    setInsights(next);
    localStorage.setItem('focusflow_insights', JSON.stringify(next));
  };

  const typeLabel = (t: string) => {
    switch (t) {
      case 'task':
        return { label: 'Task', color: 'bg-blue-50 text-blue-600' };
      case 'habit':
        return { label: 'Habit', color: 'bg-rose-50 text-rose-600' };
      case 'focus':
        return { label: 'Focus', color: 'bg-amber-50 text-amber-600' };
      default:
        return { label: 'Tip', color: 'bg-accent-50 text-accent-600' };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent-50 p-1.5 text-accent-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 active:scale-95 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Thinking…' : 'Generate'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      ) : insights.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-4 text-center text-xs text-slate-500">
          No insights yet. Complete a focus session or add tasks, then tap Generate.
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {insights.map((insight) => {
            const tl = typeLabel(insight.type);
            return (
              <div
                key={insight.id}
                className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="mt-0.5 h-5 min-w-[3.5rem] rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-center leading-4 flex items-center justify-center">
                  <span className={`px-1.5 py-0.5 rounded-full ${tl.color}`}>{tl.label}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{insight.content}</p>
                <button onClick={() => dismiss(insight.id)} className="text-slate-300 hover:text-slate-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
