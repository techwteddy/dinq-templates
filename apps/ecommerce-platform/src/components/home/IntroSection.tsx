'use client';

export default function IntroSection() {
    return (
        <section className="py-24 bg-paper border-b-2 border-ink relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-acid/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-12 text-center">
                        <div className="inline-block bg-ink text-paper px-4 py-1 rounded-lg font-bold text-xs uppercase tracking-[0.3em] mb-8">
                            The Essence ✸
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-8xl tracking-tighter text-ink mb-10 leading-[1.1] uppercase italic">
                            BRAVE <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>SCIENCE.</span><br />
                            PURE <span className="text-acid" style={{ WebkitTextStroke: '1px #0A2A1F' }}>POTENCY.</span>
                        </h2>
                    </div>

                    <div className="lg:col-span-8 lg:col-start-3 text-center">
                        <p className="font-sans text-xl md:text-2xl font-bold text-ink leading-relaxed mb-12">
                            HealMitra is not your typical wellness brand. We strip away the fluff of modern marketing to bring you the raw power of Ayurveda. Handcrafted, high-contrast healing for the bold individual.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border-2 border-ink p-6 rounded-2xl shadow-hard group hover:bg-acid transition-colors">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌿</div>
                                <h3 className="font-display text-lg mb-2">RAW NATURE</h3>
                                <p className="text-xs font-bold opacity-60 uppercase">Untouched botanical power</p>
                            </div>
                            <div className="bg-white border-2 border-ink p-6 rounded-2xl shadow-hard group hover:bg-acid transition-colors">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧘</div>
                                <h3 className="font-display text-lg mb-2">ANCIENT CODE</h3>
                                <p className="text-xs font-bold opacity-60 uppercase">5000 years of clinical proof</p>
                            </div>
                            <div className="bg-white border-2 border-ink p-6 rounded-2xl shadow-hard group hover:bg-acid transition-colors">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                                <h3 className="font-display text-lg mb-2">MODERN VIBE</h3>
                                <p className="text-xs font-bold opacity-60 uppercase">Built for today's hustle</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
