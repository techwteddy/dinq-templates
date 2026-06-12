'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/upload');
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm space-y-10 text-center animate-fade-up">
        <div className="flex flex-col items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-bright)]">Deal Flow</h1>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">PE deal sourcing pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Sign in</span>
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-base font-medium text-black transition-all hover:bg-gray-50 active:scale-[0.97] shadow-lg shadow-black/20"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {!showEmail ? (
          <button onClick={() => setShowEmail(true)} className="w-full text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            Sign in with email
          </button>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-raised)] px-4 py-3 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-raised)] px-4 py-3 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" required />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
