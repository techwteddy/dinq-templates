'use client';

export default function Marquee() {
    const items = [
        '✸ Pure Ayurveda',
        '✸ 100% Authentic',
        '✸ Free Shipping ₹499+',
        '✸ Chemical Free',
        '✸ Handcrafted in India',
        '✸ Rooted in Wisdom',
        '✸ Modern Healing',
    ];

    return (
        <div className="bg-ink text-paper overflow-hidden py-3 border-b-2 border-ink relative z-20">
            <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center gap-12 mx-4 font-display uppercase text-sm tracking-widest">
                    {items.map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {items.map((item, i) => (
                        <span key={`dup-${i}`}>{item}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
