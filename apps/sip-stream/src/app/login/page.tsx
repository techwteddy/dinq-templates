'use client';

import { AuthForm } from '../../components/auth-form';
import { useIcon } from '../../components/icon-provider';

export default function LoginPage() {
  const icon = useIcon();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 fade-in">
      <div className="text-center mb-8 slide-up">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <img
            src={icon}
            alt="SipStream Logo"
            className="w-16 h-16 rounded-full shadow-lg bg-white/80 scale-in"
            style={{ objectFit: 'cover' }}
          />
          <h1 className="text-4xl font-bold text-white">SipStream</h1>
        </div>
      </div>
      <div className="scale-in">
        <AuthForm />
      </div>
    </main>
  );
}
