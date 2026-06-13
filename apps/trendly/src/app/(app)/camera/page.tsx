import Link from "next/link";
import { X, Zap, RefreshCcw, Settings } from "lucide-react";
import Image from "next/image";

const MODES = ["TYPE", "LIVE", "NORMAL", "BOOMERANG", "FOCUS"];

export default function PictureShotPage() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <header className="px-4 pt-4 flex items-center justify-between">
        <Link href="/feed" aria-label="Close"><X size={26} /></Link>
        <div className="flex items-center gap-4">
          <Zap size={22} />
          <RefreshCcw size={22} />
          <Settings size={22} />
        </div>
      </header>

      <div className="flex-1 relative">
        <Image
          src="https://picsum.photos/seed/flowers/800/1400"
          alt="camera"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex justify-center items-center gap-6 py-4 text-[11px] uppercase tracking-wider text-white/80">
        {MODES.map((m, i) => (
          <span key={m} className={i === 2 ? "text-white font-semibold" : ""}>
            {m}
          </span>
        ))}
      </div>

      <div className="flex justify-center pb-8">
        <button className="w-16 h-16 rounded-full border-4 border-white" aria-label="Capture" />
      </div>
    </div>
  );
}
