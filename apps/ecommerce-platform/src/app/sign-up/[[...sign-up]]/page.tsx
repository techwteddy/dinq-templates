'use client';

import { SignUp } from "@clerk/nextjs";
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function SignUpPage() {
    return (
        <main className="min-h-screen bg-paper relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A2A1F 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-acid/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-ink/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-10 text-center space-y-4">
                    <Link href="/" className="inline-block group">
                        <div className="bg-ink text-acid p-4 rounded-2xl shadow-hard border-2 border-ink -rotate-3 group-hover:rotate-0 transition-transform">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                    </Link>
                    <div>
                        <h1 className="font-display text-5xl tracking-tighter uppercase italic leading-none text-ink">
                            NEW <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>CITIZEN.</span>
                        </h1>
                        <p className="font-bold opacity-30 uppercase tracking-[0.3em] text-[10px] mt-2">Enlist in the Ayurvedic Registry</p>
                    </div>
                </div>

                <div className="bg-white border-2 border-ink rounded-[2.5rem] shadow-hard-xl overflow-hidden p-2">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent border-none shadow-none p-4",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                formButtonPrimary: "bg-ink text-acid hover:bg-ink/90 border-2 border-ink py-6 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard-acid transition-all active:translate-y-1 active:shadow-none",
                                formFieldInput: "bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none focus:bg-white transition-all shadow-hard-sm",
                                formFieldLabel: "text-[10px] font-bold uppercase tracking-widest opacity-40 italic mb-2 ml-1",
                                footerActionLink: "text-ink font-bold hover:text-acid underline transition-colors",
                                dividerLine: "bg-ink/10",
                                dividerText: "text-[10px] font-bold uppercase tracking-widest opacity-20",
                                socialButtonsBlockButton: "border-2 border-ink rounded-xl font-bold bg-white shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all py-3",
                                footer: "bg-stone/5 border-t-2 border-ink/5 mt-4 p-4",
                                scrollBox: "no-scrollbar",
                            }
                        }}
                    />
                </div>

                <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-20 italic">
                    Welcome to the fold ✦ Secure Connection Deployed
                </p>
            </div>
        </main>
    );
}
