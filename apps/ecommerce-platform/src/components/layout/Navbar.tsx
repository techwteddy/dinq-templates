'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { ShoppingCart, Menu, X, Search, User, ShoppingBag, Mail, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { isSignedIn, isLoaded } = useUser();
    const itemCount = useCartStore((state) => state.getItemCount());

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { href: '/shop', label: 'NEW DROPS' },
        { href: '/shop', label: 'SHOP' },
        { href: '/about', label: 'OUR STORY' },
        { href: '/contact', label: 'CONTACT' },
    ];

    return (
        <nav className="sticky top-4 z-50 px-4 md:px-8 mb-2">
            <div className="bg-paper border-2 border-ink rounded-xl shadow-hard flex justify-between items-center p-4">
                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-acid rounded-lg border border-transparent hover:border-ink transition-all"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden group-hover:rotate-3 transition-transform mix-blend-multiply">
                        <Image
                            src="/images/logo-icon.png"
                            alt="HealMitra"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <span className="text-xl md:text-2xl font-display tracking-tighter uppercase italic">
                        HEAL<span className="text-acid" style={{ WebkitTextStroke: '1px #0A2A1F' }}>MITRA</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-tight">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="hover:text-acid hover:bg-ink px-3 py-1 rounded transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="hidden md:block hover:bg-acid rounded-lg p-2 border border-transparent hover:border-ink transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 border-r-2 border-ink/10 pr-3 mr-1">
                        {isLoaded && (
                            isSignedIn ? (
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 border-2 border-ink shadow-hard-sm hover:rotate-3 transition-transform",
                                            userButtonPopoverCard: "border-2 border-ink shadow-hard rounded-2xl",
                                        }
                                    }}
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="Orders"
                                            labelIcon={<ShoppingBag className="w-4 h-4" />}
                                            href="/orders"
                                        />
                                        <UserButton.Link
                                            label="Profile"
                                            labelIcon={<User className="w-4 h-4" />}
                                            href="/profile"
                                        />
                                        <UserButton.Link
                                            label="FAQs"
                                            labelIcon={<AlertCircle className="w-4 h-4" />}
                                            href="/faqs"
                                        />
                                        <UserButton.Link
                                            label="Contact Us"
                                            labelIcon={<Mail className="w-4 h-4" />}
                                            href="/contact"
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="hidden md:block hover:bg-acid rounded-lg p-2 border border-transparent hover:border-ink transition-all">
                                        <User className="w-5 h-5" />
                                    </button>
                                </SignInButton>
                            )
                        )}
                    </div>
                    <Link href="/cart">
                        <button className="bg-ink text-acid px-4 py-2 rounded-lg font-display text-sm border-2 border-ink hover:bg-acid hover:text-ink transition-colors flex items-center gap-2 group">
                            CART ({mounted ? itemCount : 0})
                            <div className={mounted && itemCount > 0 ? "w-2 h-2 bg-acid rounded-full group-hover:bg-ink animate-pulse" : "hidden"} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                <div
                    className={`absolute top-4 left-4 right-4 bg-paper border-2 border-ink rounded-xl shadow-hard p-6 flex flex-col gap-4 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-8'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-display text-xl">MENU</span>
                        <div className="flex gap-2">
                            {!isSignedIn && isLoaded && (
                                <SignInButton mode="modal">
                                    <button className="p-2 border-2 border-ink rounded-lg bg-white shadow-hard-sm">
                                        <User className="w-6 h-6" />
                                    </button>
                                </SignInButton>
                            )}
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border-2 border-ink rounded-lg bg-acid shadow-hard-sm">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-display text-lg hover:text-acid hover:bg-ink px-4 py-3 rounded-lg border-2 border-transparent hover:border-ink transition-all flex items-center justify-between"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t-2 border-ink/10 flex flex-col gap-3">
                        <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full bg-ink text-acid px-4 py-4 rounded-xl font-display text-lg border-2 border-ink flex items-center justify-center gap-2 shadow-hard-sm">
                                GO TO CART ({mounted ? itemCount : 0})
                            </button>
                        </Link>
                        {isSignedIn && (
                            <div className="flex flex-col gap-2 bg-paper border-2 border-ink p-4 rounded-xl">
                                <div className="flex items-center gap-4 mb-2">
                                    <UserButton afterSignOutUrl="/" />
                                    <span className="font-display text-sm italic uppercase">Account Management</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="bg-stone/10 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center border border-ink/10 hover:border-ink transition-all">Orders</Link>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="bg-stone/10 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center border border-ink/10 hover:border-ink transition-all">Profile</Link>
                                    <Link href="/faqs" onClick={() => setIsMobileMenuOpen(false)} className="bg-stone/10 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center border border-ink/10 hover:border-ink transition-all">FAQs</Link>
                                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-stone/10 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center border border-ink/10 hover:border-ink transition-all">Contact Us</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
