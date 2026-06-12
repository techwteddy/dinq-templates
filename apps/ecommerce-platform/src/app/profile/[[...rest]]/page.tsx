'use client';

import { UserProfile, useUser } from '@clerk/nextjs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import Link from 'next/link';
import { User, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return (
            <>
                <Marquee />
                <Navbar />
                <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 pb-24 text-center">
                    <div className="bg-ink text-acid p-6 rounded-3xl shadow-hard border-2 border-ink mb-8 rotate-3">
                        <User className="w-12 h-12" />
                    </div>
                    <h1 className="font-display text-4xl uppercase italic mb-4 leading-none">Identity Check Failed</h1>
                    <p className="font-bold opacity-40 uppercase tracking-widest text-xs mb-8 max-w-xs">Enlist or authenticate your bio-data to access the profile registry</p>
                    <Link href="/sign-in">
                        <button className="bg-ink text-acid border-2 border-ink px-10 py-5 rounded-2xl font-display text-xl tracking-widest uppercase italic shadow-hard hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">AUTHENTICATE</button>
                    </Link>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-24">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-ink uppercase leading-none italic">
                                CITIZEN <span className="text-outline" style={{ WebkitTextStroke: '2.5px #0A2A1F' }}>PROFILE.</span>
                            </h1>
                            <p className="font-bold opacity-30 mt-4 uppercase tracking-[0.3em] text-[10px]">Registry ID: {user.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="bg-acid text-ink px-4 py-2 border-2 border-ink rounded-xl shadow-hard-sm flex items-center gap-2 -rotate-2">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Citizen</span>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-ink rounded-[2.5rem] shadow-hard overflow-hidden">
                        <div className="p-2 md:p-8">
                            <UserProfile
                                routing="path"
                                path="/profile"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-none border-none p-0 bg-transparent",
                                        navbar: "hidden", // Hide clerk sidebar if we want full width
                                        pageScrollBox: "p-0",
                                        headerTitle: "font-display text-xl uppercase italic text-ink mb-6 pb-2 border-b-2 border-ink/5",
                                        headerSubtitle: "hidden",
                                        profileSectionTitleText: "font-display text-lg uppercase italic text-ink/60",
                                        formButtonPrimary: "bg-ink text-acid hover:bg-ink/90 border-2 border-ink rounded-xl font-bold uppercase tracking-widest transition-all",
                                        formFieldInput: "bg-paper border-2 border-ink rounded-xl px-4 py-3 font-sans font-bold shadow-hard-sm focus:shadow-none transition-all",
                                        userPreviewMainIdentifier: "font-display text-2xl uppercase italic text-ink",
                                        userPreviewSecondaryIdentifier: "font-sans font-bold opacity-40 uppercase tracking-widest text-[10px]",
                                        userButtonPopoverCard: "border-2 border-ink shadow-hard rounded-2xl",
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] italic">Bio-data protection active ✦ HealMitra Security</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
