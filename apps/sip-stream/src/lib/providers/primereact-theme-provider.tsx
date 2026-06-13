'use client';

import { PrimeReactProvider } from 'primereact/api';
import { ReactNode } from 'react';
import 'primereact/resources/themes/vela-orange/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export function PrimeReactThemeProvider({ children }: { children: ReactNode }) {
  return (
    <PrimeReactProvider>
      <style jsx global>{`
        .p-button {
          padding: 0.75rem 1.5rem !important;
          font-size: 1rem !important;
          border-radius: 0.5rem !important;
        }
        .p-button-lg {
          padding: 1rem 2rem !important;
          font-size: 1.125rem !important;
        }
        .p-inputtext {
          padding: 0.75rem 1rem !important;
          font-size: 1rem !important;
        }
        .p-password {
          width: 100% !important;
        }
        .p-password-input {
          width: 100% !important;
          padding: 0.75rem 1rem !important;
          font-size: 1rem !important;
        }
      `}</style>
      {children}
    </PrimeReactProvider>
  );
}
