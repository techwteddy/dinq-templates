'use client';

import { Toaster } from 'react-hot-toast';

export default function AdminProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'border-2 border-ink font-sans font-bold shadow-hard-sm',
                    duration: 3000,
                    style: {
                        background: '#F8F4E8',
                        color: '#0A2A1F',
                        borderRadius: '12px',
                    },
                }}
            />
            {children}
        </>
    );
}
