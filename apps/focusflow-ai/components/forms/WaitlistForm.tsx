'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "You're on the list!");
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        setEmail('');
        setName('');
      } else {
        toast.error(json.error || 'Something went wrong');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500 active:scale-95 transition disabled:opacity-60"
      >
        {loading ? 'Joining…' : 'Join Waitlist'}
      </button>
    </form>
  );
}
