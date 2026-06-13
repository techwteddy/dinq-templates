'use client';

import { useSupabase } from '../lib/providers/supabase-provider';
import { Message } from 'primereact/message';

export function ConnectionStatus() {
  const { isConnected, connectionError } = useSupabase();

  if (connectionError) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Message severity="error" text={connectionError} className="w-full" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Message severity="warn" text="Connecting to server..." className="w-full" />
      </div>
    );
  }

  return null;
}
