import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const MESSAGES = ["Are you here?", "Yes, I am.", "Speak soon."];
const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_BEFORE_DELETE = 2000;

function TypingMessages() {
  const [displayedText, setDisplayedText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = MESSAGES[messageIndex];

    if (!isDeleting && displayedText === current) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_BEFORE_DELETE);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
      return;
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timeout = setTimeout(() => {
      setDisplayedText(isDeleting
        ? current.slice(0, displayedText.length - 1)
        : current.slice(0, displayedText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, messageIndex]);

  return (
    <div className="absolute left-[48.5%] md:left-[47.5%] lg:left-[48.5%] -translate-x-1/2 bottom-[32%] z-30 w-[110px] sm:w-[130px] flex justify-start text-left">
      <span
        className="text-[#2A3616] text-[10px] sm:text-[14px] leading-tight break-words min-h-[1.5em]"
        style={{ fontFamily: 'var(--font-nokia)' }}
      >
        {displayedText}
        <motion.span
          className="inline-block w-1.5 h-3 bg-[#2A3616] ml-1 align-middle"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </span>
    </div>
  );
}

function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none">
      <nav className="pointer-events-auto backdrop-blur-md rounded-full bg-transparent border border-black/10 flex items-center justify-between px-5 py-3">
        <span
          className="text-[#1a1a1a] text-[28px] tracking-tight select-none"
          style={{ fontFamily: 'var(--font-instrument)' }}
        >
          dot.
        </span>

        <div className="hidden md:flex items-center gap-10">
          {['Philosophy', 'Trust', 'Access', 'Tribe'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#1a1a1a] text-[14px] font-normal transition-opacity hover:opacity-50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {link}
            </a>
          ))}
        </div>

        <button
          className="group relative overflow-hidden bg-[#0871E7] text-white rounded-full px-5 py-2 text-[14px] font-normal shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline outline-1 outline-[#0871E7] -outline-offset-1 transition-opacity hover:opacity-90"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <span
            className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] transition-transform group-hover:scale-x-105"
          />
          <span className="relative z-10">Link up</span>
        </button>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F3F4ED] pt-24 md:pt-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-white/5" />
      </div>

      {/* Typing overlay on phone screen */}
      <TypingMessages />

      {/* Hero text */}
      <div className="relative z-20 pointer-events-none text-center px-6">
        <motion.h1
          className="text-[#1a1a1a] text-[38px] md:text-[56px] lg:text-[72px] leading-[0.85] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-instrument)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Short notes.<br />Daily calm.
        </motion.h1>

        <motion.p
          className="text-[#1a1a1a]/70 text-[16px] md:text-[18px] leading-relaxed font-normal max-w-xl mx-auto"
          style={{ fontFamily: 'var(--font-sans)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Linked with a single anonymous peer. One message every day. A quiet rhythm in the digital noise.
        </motion.p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
