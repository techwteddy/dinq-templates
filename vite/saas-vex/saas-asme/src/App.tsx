import { useRef, useEffect } from 'react';
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  function cancelAnim() {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }

  function fadeIn(video: HTMLVideoElement) {
    cancelAnim();
    fadingOutRef.current = false;
    const duration = 500;
    const start = performance.now();
    const startOpacity = video.style.opacity === '' ? 0 : parseFloat(video.style.opacity) || 0;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    }
    animFrameRef.current = requestAnimationFrame(step);
  }

  function fadeOut(video: HTMLVideoElement) {
    cancelAnim();
    fadingOutRef.current = true;
    const duration = 500;
    const start = performance.now();
    const startOpacity = video.style.opacity === '' ? 1 : parseFloat(video.style.opacity) || 1;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      video.style.opacity = String(startOpacity * (1 - progress));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    }
    animFrameRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';

    function handleCanPlay() {
      if (video) fadeIn(video);
    }

    function handleTimeUpdate() {
      if (!video || fadingOutRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (!isNaN(remaining) && remaining <= 0.55) {
        fadeOut(video);
      }
    }

    function handleEnded() {
      if (!video) return;
      cancelAnim();
      video.style.opacity = '0';
      fadingOutRef.current = false;
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().then(() => fadeIn(video)).catch(() => {});
      }, 100);
    }

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelAnim();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          muted
          autoPlay
          playsInline
          loop={false}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg">Asme</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white text-sm font-medium">Sign Up</button>
            <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        <div className="max-w-xl w-full space-y-4">
          {/* Email input */}
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-base outline-none"
            />
            <button className="bg-white rounded-full p-3 text-black flex-shrink-0">
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          {/* Manifesto button */}
          <div className="flex justify-center">
            <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Read our manifesto
            </button>
          </div>
        </div>
      </div>

      {/* Social icons footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button aria-label="Instagram" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram size={20} />
        </button>
        <button aria-label="Twitter" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter size={20} />
        </button>
        <button aria-label="Website" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={20} />
        </button>
      </div>
    </div>
  );
}
