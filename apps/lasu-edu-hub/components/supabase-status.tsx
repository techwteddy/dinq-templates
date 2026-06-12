'use client';

import { isSupabaseConfigured } from '@/lib/storage';

export function SupabaseStatus() {
  if (isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div>
          <h3 className="font-bold mb-1">Supabase Not Configured</h3>
          <p className="text-sm mb-2">
            The environment variables for Supabase are missing. 
          </p>
          <p className="text-sm mb-2">
            To use this application, you need to set up your Supabase project and add the environment variables.
          </p>
          <a 
            href="https://supabase.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm underline hover:opacity-80"
          >
            Read the Supabase docs
          </a>
          {' | '}
          <a 
            href="/ENVIRONMENT_SETUP.md" 
            target="_blank"
            className="text-sm underline hover:opacity-80"
          >
            Setup Instructions
          </a>
        </div>
      </div>
    </div>
  );
}
