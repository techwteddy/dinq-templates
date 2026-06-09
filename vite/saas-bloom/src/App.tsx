import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
} from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4';

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="15" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <path
        d="M16 6 C16 6 10 10 10 16 C10 20 12 23 16 26 C20 23 22 20 22 16 C22 10 16 6 16 6Z"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
      />
      <path
        d="M16 26 C16 26 9 22 8 16 C7 11 11 7 16 6"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="16" cy="16" r="2.5" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden font-display">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-black/20" />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-row h-full">
        {/* ── LEFT PANEL ── */}
        <div className="relative flex flex-col w-full lg:w-[52%] h-full p-4 lg:p-6">
          {/* Glass overlay for left panel */}
          <div className="liquid-glass-strong absolute inset-4 lg:inset-6 rounded-3xl z-0" />

          {/* Content sits above the glass overlay */}
          <div className="relative z-10 flex flex-col h-full px-6 py-5 lg:px-8 lg:py-6">
            {/* Nav */}
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LogoMark size={32} />
                <span className="font-semibold text-2xl tracking-tighter text-white">bloom</span>
              </div>
              <button className="liquid-glass rounded-full flex items-center gap-2 px-4 py-2 text-white/80 text-sm font-medium hover:scale-105 transition-transform">
                <Menu size={16} />
                <span>Menu</span>
              </button>
            </nav>

            {/* Hero Center */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
              <LogoMark size={80} />

              <h1 className="text-6xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-[1.05]">
                Innovating the<br />
                spirit of{' '}
                <em className="font-serif italic not-italic text-white/80 font-light">bloom</em>
                {' '}AI
              </h1>

              {/* CTA Button */}
              <button className="liquid-glass-strong rounded-full flex items-center gap-3 px-6 py-3.5 text-white font-medium text-sm hover:scale-105 active:scale-95 transition-transform">
                <span>Explore Now</span>
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <Download size={14} />
                </span>
              </button>

              {/* Pills */}
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                {['Artistic Gallery', 'AI Generation', '3D Structures'].map((label) => (
                  <span
                    key={label}
                    className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="flex flex-col items-center gap-3 pb-2">
              <span className="text-xs tracking-widest uppercase text-white/50 font-medium">
                Visionary Design
              </span>
              <p className="text-white/90 text-base font-light text-center leading-relaxed">
                <span className="font-display">"We imagined a realm</span>{' '}
                <em className="font-serif italic text-white/70">with no ending."</em>
              </p>
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-white/20 w-12" />
                <span className="text-xs tracking-widest uppercase text-white/50 font-medium">
                  Marcus Aurelio
                </span>
                <span className="flex-1 h-px bg-white/20 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (desktop only) ── */}
        <div className="hidden lg:flex lg:w-[48%] h-full flex-col p-6 pl-3 gap-4">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            {/* Social icons pill */}
            <div className="liquid-glass rounded-full flex items-center gap-1 px-3 py-2">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Instagram, label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-colors hover:scale-105 transition-transform"
                >
                  <Icon size={14} />
                </a>
              ))}
              <span className="w-px h-4 bg-white/20 mx-1" />
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-colors hover:scale-105">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Account button */}
            <button className="liquid-glass rounded-full flex items-center gap-2 px-4 py-2 text-white/80 text-sm font-medium hover:scale-105 transition-transform">
              <Sparkles size={14} />
              <span>Account</span>
            </button>
          </div>

          {/* Community Card */}
          <div className="liquid-glass rounded-2xl p-4 w-56">
            <p className="text-white text-sm font-medium mb-1">Enter our ecosystem</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Connect with floral artists and AI designers shaping the future of bloom.
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Feature Section */}
          <div className="liquid-glass rounded-[2.5rem] p-4 flex flex-col gap-3">
            {/* Two side-by-side cards */}
            <div className="flex gap-3">
              <div className="liquid-glass rounded-3xl flex-1 p-4 flex flex-col gap-2">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Wand2 size={15} />
                </span>
                <p className="text-white text-sm font-medium">Processing</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  Real-time AI rendering for your floral compositions.
                </p>
              </div>

              <div className="liquid-glass rounded-3xl flex-1 p-4 flex flex-col gap-2">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <BookOpen size={15} />
                </span>
                <p className="text-white text-sm font-medium">Growth Archive</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  A living library of botanical structures and designs.
                </p>
              </div>
            </div>

            {/* Bottom card */}
            <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
              <img
                src="https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=200&h=128&dpr=2"
                alt="Flowers"
                className="w-24 h-16 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-tight">
                  Advanced Plant Sculpting
                </p>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">
                  Shape organic forms with precision AI tools built for botanical artistry.
                </p>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-lg hover:scale-105 transition-transform flex-shrink-0">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
