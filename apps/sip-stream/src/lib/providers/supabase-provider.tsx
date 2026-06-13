'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

interface SupabaseContextType {
  supabase: SupabaseClient<Database> | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isConnected: false,
  connectionError: null,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    console.log('SupabaseProvider: Initializing Supabase client');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const error = 'Missing Supabase environment variables';
      console.error('SupabaseProvider:', error);
      console.error('SupabaseProvider: NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
      console.error(
        'SupabaseProvider: NEXT_PUBLIC_SUPABASE_ANON_KEY:',
        supabaseAnonKey ? 'Set' : 'Missing'
      );
      setConnectionError(error);
      return;
    }

    try {
      console.log('SupabaseProvider: Creating Supabase client with URL:', supabaseUrl);
      const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });

      // Test the connection
      async function testConnection() {
        try {
          console.log('SupabaseProvider: Testing connection...');
          const { error } = await client.from('games').select('count').limit(1);

          if (error) {
            console.error('SupabaseProvider: Connection test failed:', error);
            setConnectionError(`Connection failed: ${error.message}`);
            setIsConnected(false);
          } else {
            console.log('SupabaseProvider: Connection successful');
            setIsConnected(true);
            setConnectionError(null);
          }
        } catch (err) {
          console.error('SupabaseProvider: Connection test error:', err);
          setConnectionError(
            `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
          setIsConnected(false);
        }
      }

      setSupabase(client);
      testConnection();

      // Set up auth state listener
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((event, session) => {
        console.log('SupabaseProvider: Auth state changed:', {
          event,
          session: session ? 'present' : 'null',
        });
      });

      return () => {
        console.log('SupabaseProvider: Cleaning up auth subscription');
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('SupabaseProvider: Failed to create client:', err);
      setConnectionError(
        `Failed to create client: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }, []);

  const value = {
    supabase,
    isConnected,
    connectionError,
  };

  console.log('SupabaseProvider: Rendering with state:', {
    hasClient: !!supabase,
    isConnected,
    hasError: !!connectionError,
  });

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
