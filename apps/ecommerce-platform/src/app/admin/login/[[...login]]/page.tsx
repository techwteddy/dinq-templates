'use client';

import { SignIn } from "@clerk/nextjs";
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-ink relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D2E823 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-acid/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-10 text-center space-y-4">
                    <div className="bg-acid text-ink p-4 rounded-2xl shadow-hard-acid border-2 border-ink inline-block mb-4 rotate-3">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h1 className="font-display text-5xl tracking-tighter uppercase italic leading-none text-paper">
                        HQ <span className="text-acid" style={{ WebkitTextStroke: '1px #D2E823' }}>CONTROL.</span>
                    </h1>
                    <p className="font-bold opacity-40 uppercase tracking-[0.3em] text-[10px] text-paper mt-2">Operative authentication required</p>
                </div>

                <div className="bg-paper border-4 border-acid rounded-[2.5rem] shadow-hard-acid overflow-hidden p-2">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent border-none shadow-none p-4",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                formButtonPrimary: "bg-acid text-ink hover:bg-acid/90 border-2 border-ink py-6 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard transition-all active:translate-y-1 active:shadow-none",
                                formFieldInput: "bg-white border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm",
                                formFieldLabel: "text-[10px] font-bold uppercase tracking-widest opacity-40 italic mb-2 ml-1",
                                footerAction: "hidden", // Hide sign-up link for admin login
                                dividerLine: "bg-ink/10",
                                dividerText: "text-[10px] font-bold uppercase tracking-widest opacity-20",
                                socialButtonsBlockButton: "border-2 border-ink rounded-xl font-bold bg-white shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all py-3",
                                footer: "hidden",
                                scrollBox: "no-scrollbar",
                            }
                        }}
                        afterSignInUrl="/admin"
                    />
                </div>

                <div className="text-center mt-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-paper/40 hover:text-acid transition-colors">
                        ← Return to Public Terminal
                    </Link>
                </div>
            </div>
        </main>
    );
}
