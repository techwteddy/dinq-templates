'use client';

import { CircleCheck } from 'lucide-react';

const badges = [
    'NO HIDDEN CHEMICALS',
    'LAB TESTED POTENCY',
    'ETHICALLY SOURCED',
    'CLINICALLY EFFECTIVE',
    '100% RECYCLABLE',
];

export default function TrustBadges() {
    return (
        <section className="py-16 bg-ink border-y-2 border-ink overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {badges.map((badge) => (
                        <div
                            key={badge}
                            className="flex items-center gap-4 group"
                        >
                            <div className="bg-acid p-1 rounded-lg border-2 border-paper shadow-hard-sm group-hover:rotate-12 transition-transform">
                                <CircleCheck className="h-6 w-6 text-ink stroke-[3]" />
                            </div>
                            <span className="text-sm md:text-lg font-display text-paper tracking-wider">
                                {badge}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
