'use client';

import {
    Search,
    Bell,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

export default function AdminTopBar() {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <header className="h-20 bg-paper/80 backdrop-blur-md border-b-2 border-ink px-6 flex items-center justify-between sticky top-0 z-40">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span className="hover:text-ink cursor-default">Admin</span>
                    {segments.slice(1).map((segment, i) => (
                        <div key={segment} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" />
                            <span className={i === segments.length - 2 ? 'text-ink' : ''}>
                                {segment}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    target="_blank"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 border-2 border-ink rounded-lg text-[10px] font-bold uppercase hover:bg-stone transition-colors shadow-hard-sm"
                >
                    Live Site <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="h-8 w-[2px] bg-ink/10 hidden md:block" />

                <div className="flex items-center gap-2">
                    <button className="p-2 border-2 border-ink rounded-xl bg-white hover:bg-acid transition-colors shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                        <Search className="w-5 h-5" />
                    </button>

                    <button className="relative p-2 border-2 border-ink rounded-xl bg-white hover:bg-acid transition-colors shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-ink rounded-full" />
                    </button>
                </div>

                <div className="flex items-center gap-3 pl-2 border-l-2 border-ink/10">
                    {isLoaded && user && (
                        <>
                            <div className="hidden lg:block text-right">
                                <p className="text-[10px] font-bold uppercase tracking-tighter">{user.fullName || 'Operative'}</p>
                                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest leading-none">{user.primaryEmailAddress?.emailAddress}</p>
                            </div>
                            <UserButton
                                afterSignOutUrl="/admin/login"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 border-2 border-ink rounded-xl shadow-hard-sm",
                                        popoverCard: "border-2 border-ink shadow-hard rounded-2xl",
                                    }
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
