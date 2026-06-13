'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from '../lib/providers/supabase-provider';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  supabase: ReturnType<typeof useSupabase>['supabase'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, isConnected, connectionError } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Initializing with connection status:', {
      isConnected,
      connectionError,
    });

    if (!supabase) {
      console.log('AuthProvider: No Supabase client available');
      setLoading(false);
      return;
    }

    if (connectionError) {
      console.error('AuthProvider: Connection error:', connectionError);
      setError(connectionError);
      setLoading(false);
      return;
    }

    // Get initial session
    async function getInitialSession() {
      if (!supabase) return;
      try {
        console.log('AuthProvider: Getting initial session...');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthProvider: Error getting session:', error);
          setError(error.message);
        } else {
          console.log('AuthProvider: Initial session:', session ? 'present' : 'null');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('AuthProvider: Error in getInitialSession:', err);
        setError(err instanceof Error ? err.message : 'Failed to get session');
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state change:', {
        event,
        session: session ? 'present' : 'null',
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [supabase, isConnected, connectionError]);

  const value = {
    user,
    session,
    loading,
    error,
    supabase,
  };

  console.log('AuthProvider: Rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    hasError: !!error,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
