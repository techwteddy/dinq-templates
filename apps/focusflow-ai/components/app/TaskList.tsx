'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      if (json.success) setTasks(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const optimistic: Task = {
      id: `temp-${Date.now()}`,
      title: newTitle.trim(),
      status: 'todo',
      priority: 'medium',
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [optimistic, ...prev]);
    setNewTitle('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: optimistic.title, priority: 'medium' }),
      });
      const json = await res.json();
      if (json.success) {
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? json.data : t)));
        toast.success('Task added');
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
        toast.error('Failed to add task');
      }
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      toast.error('Failed to add task');
    }
  };

  const toggleStatus = async (task: Task) => {
    const next = task.status === 'done' ? 'todo' : 'done';
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Sync failed');
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    }
  };

  const removeTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Task removed');
    } catch {
      toast.error('Failed to remove');
      fetchTasks();
    }
  };

  const priorityColor = (p?: string | null) => {
    switch (p) {
      case 'high':
        return 'text-rose-500 bg-rose-50';
      case 'medium':
        return 'text-amber-500 bg-amber-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={addTask}
          className="rounded-lg bg-brand-600 text-white px-3 py-2 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No tasks yet. Add one above to get started.
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-sm"
            >
              <button onClick={() => toggleStatus(task)} className="text-slate-400 hover:text-brand-600 transition">
                {task.status === 'done' ? (
                  <CheckCircle2 className="h-5 w-5 text-brand-600 fill-brand-100" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${priorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <button onClick={() => removeTask(task.id)} className="text-slate-300 hover:text-rose-500 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
