'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    BarChart3,
    Archive,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldAlert
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Discounts', icon: Tag, href: '/admin/discounts' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { name: 'Inventory', icon: Archive, href: '/admin/inventory' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const { signOut } = useClerk();

    const NavLink = ({ item }: { item: typeof navItems[0] }) => {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 border-2 border-transparent transition-all group ${isActive
                    ? 'bg-acid text-ink border-ink rounded-rv shadow-hard-sm translate-x-1 translate-y-1'
                    : 'text-ink/60 hover:text-ink hover:bg-white hover:rounded-rv hover:shadow-hard-sm'
                    }`}
            >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-ink' : ''}`} />
                <span className="font-display text-sm tracking-widest uppercase italic">{item.name}</span>
                {isActive && <div className="ml-auto w-2 h-2 bg-ink rounded-full" />}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[100] bg-ink text-acid p-4 rounded-full shadow-hard-xl border-2 border-ink active:scale-90 transition-transform"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[80] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-paper border-r-2 border-ink z-[90] transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="mb-12 pt-4 px-6">
                        <Link href="/admin" className="block">
                            <div className="bg-ink text-acid p-3 rounded-xl shadow-hard border-2 border-ink inline-block mb-4 -rotate-3">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h1 className="font-display text-2xl tracking-tighter leading-none italic">
                                HEALMITRA <br />
                                <span className="text-outline text-xl" style={{ WebkitTextStroke: '1.5px #0A2A1F' }}>CONTROL.</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
                        {navItems.map((item) => (
                            <NavLink key={item.name} item={item} />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="mt-auto pt-8 border-t-2 border-ink/10">
                        <button
                            onClick={() => signOut({ redirectUrl: '/admin/login' })}
                            className="flex items-center gap-4 px-6 py-4 w-full text-ink/40 hover:text-red-600 transition-colors group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-display text-sm tracking-widest uppercase italic">Eject System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Spacer for Desktop */}
            <div className="hidden lg:block w-[280px] shrink-0" />
        </>
    );
}
