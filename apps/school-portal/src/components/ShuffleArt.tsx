"use client"
import { useState } from "react";
import { RefreshCcw } from "lucide-react";

export function ShuffleArt({ initialArt, buttonText }: { initialArt: { image_url: string }[], buttonText: string }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const nextImage = () => {
    setFade(false);
    setTimeout(() => {
      const nextIndex = Math.floor(Math.random() * initialArt.length);
      setIndex(nextIndex);
      setFade(true);
    }, 300);
  };

  if (initialArt.length === 0) return <div className="p-20 border rounded-3xl italic text-slate-400">No drawings yet. Upload some!</div>;

  return (
    <div className="flex flex-col items-center gap-4 w-full flex-1 min-h-0">
      {/* Image fills all available vertical space */}
      <div className={`relative flex-1 min-h-0 w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-2xl transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={initialArt[index].image_url}
          alt="Student Artwork"
          className="h-full w-full object-cover"
        />
      </div>

      <button
        onClick={nextImage}
        className="shrink-0 group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
      >
        <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        {buttonText}
      </button>
    </div>
  );
}