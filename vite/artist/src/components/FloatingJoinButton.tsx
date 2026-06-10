import { ArrowRight } from 'lucide-react';

export default function FloatingJoinButton() {
  return (
    <a
      href="#join"
      className="floating-join-btn group flex items-center gap-3 bg-black text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-all duration-300"
    >
      <span className="text-lg font-medium">Join</span>
      <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  );
}
