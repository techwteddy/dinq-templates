import Link from "next/link";
import { ChevronLeft, Send, Smile, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function LivePage() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <header className="px-3 pt-3 pb-2 flex items-center gap-2">
        <Link href="/feed" className="text-white"><ChevronLeft size={28} /></Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="live-badge text-[10px] font-bold px-2 py-0.5 rounded text-white">LIVE</div>
          <span className="text-sm">1 viewer</span>
        </div>
        <button className="text-sm font-semibold">End</button>
      </header>

      <div className="flex-1 relative">
        <Image
          src="https://picsum.photos/seed/live/800/1400"
          alt="live"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute bottom-24 left-0 right-0 px-3">
          <div className="bg-black/40 rounded-lg px-3 py-2 text-sm">
            <span className="font-semibold">you</span> — You&apos;re going live. Say hi!
          </div>
        </div>
      </div>

      <div className="p-3 flex items-center gap-2">
        <div className="flex-1 h-10 rounded-full border border-white/40 px-3 flex items-center text-sm text-white/70">
          Comment
        </div>
        <button><HelpCircle size={22} /></button>
        <button><Smile size={22} /></button>
        <button><Send size={22} /></button>
      </div>
    </div>
  );
}
