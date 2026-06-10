import Image from "next/image";

export const TrustStack = () => {
  const partners = [
    { name: "n8n", category: "Automation" },
    { name: "Google Deep Think", category: "Intelligence" },
    { name: "Google Cloud & Microsoft Azure", category: "Infrastructure" },
    { name: "VAPI & ElevenLabs", category: "Voice AI" },
    { name: "Gemini, Claude & OpenAI", category: "LLM" },
  ];

  return (
    <div className="py-12 border-y border-black/5 dark:border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl mb-24 relative">
      {/* Verified Power User Sticker */}
      <div className="absolute -top-10 -left-6 w-24 h-24 md:w-32 md:h-32 rotate-[-15deg] z-20 drop-shadow-2xl transition-all duration-500 hover:rotate-[-5deg] hover:scale-110 select-none">
        <Image 
          src="/images/verified power user  v3_1.png" 
          alt="Verified Power User"
          width={128}
          height={128}
          className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/60">
          Strategic Technical Stack
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {partners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-foreground">
              {partner.name}
            </span>
            <span className="text-[10px] uppercase tracking-tighter text-foreground/40 font-mono">
              {partner.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
