import { useEffect, useRef, useState } from 'react';

/* ── Xero "X" logo path ────────────────────────────────────── */
function XeroLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6 L17.5 20 L6 34 L11 34 L20 22.5 L29 34 L34 34 L22.5 20 L34 6 L29 6 L20 17.5 L11 6 Z"
        fill="white"
      />
    </svg>
  );
}

/* ── Brand SVGs ─────────────────────────────────────────────── */
function ExpediaLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path fill="var(--bg)" d="M8 9h8v2H8zm0 4h6v2H8z" />
    </svg>
  );
}

function AsanaLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4" fill="currentColor" />
      <circle cx="5" cy="16" r="3.5" fill="currentColor" />
      <circle cx="19" cy="16" r="3.5" fill="currentColor" />
    </svg>
  );
}

function ZenefitsLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="4,12 12,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="4,16 20,16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HubSpotLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15.5" cy="8.5" r="2.5" fill="currentColor" />
      <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 8.5 L13 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 10.5 L8.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 14 L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LoomLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type BeamState = 'p1' | 'splash' | 'p2' | 'idle';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* Pipeline refs */
  const pipelineRef = useRef<HTMLDivElement>(null);
  const nodeStackRef = useRef<HTMLDivElement>(null);
  const nodeXRef = useRef<HTMLDivElement>(null);
  const nodeShieldRef = useRef<HTMLDivElement>(null);
  const beamPath1Ref = useRef<SVGPathElement>(null);
  const beamPath2Ref = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  /* Toggle mobile menu */
  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  /* Beam animation */
  useEffect(() => {
    let rafId: number;
    let state: BeamState = 'p1';
    let lastStateChange = performance.now();

    const DURATIONS: Record<BeamState, number> = {
      p1: 800,
      splash: 800,
      p2: 800,
      idle: 1000,
    };

    /* Compute SVG path from node positions */
    function buildPath() {
      const pipeline = pipelineRef.current;
      const nodeStack = nodeStackRef.current;
      const nodeX = nodeXRef.current;
      const nodeShield = nodeShieldRef.current;
      if (!pipeline || !nodeStack || !nodeX || !nodeShield) return null;

      const pRect = pipeline.getBoundingClientRect();
      const sRect = nodeStack.getBoundingClientRect();
      const xRect = nodeX.getBoundingClientRect();
      const shRect = nodeShield.getBoundingClientRect();

      const startX = sRect.left + sRect.width / 2 - pRect.left;
      const startY = sRect.top + sRect.height / 2 - pRect.top;
      const midX = xRect.left + xRect.width / 2 - pRect.left;
      const midY = xRect.top + xRect.height / 2 - pRect.top;
      const endX = shRect.left + shRect.width / 2 - pRect.left;
      const endY = shRect.top + shRect.height / 2 - pRect.top;

      return `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
    }

    function updatePath() {
      const d = buildPath();
      if (!d) return;
      if (beamPath1Ref.current) beamPath1Ref.current.setAttribute('d', d);
      if (beamPath2Ref.current) beamPath2Ref.current.setAttribute('d', d);
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function frame(now: number) {
      const elapsed = now - lastStateChange;
      const dur = DURATIONS[state];
      const t = Math.min(elapsed / dur, 1);

      const gradient = gradientRef.current;
      const path1 = beamPath1Ref.current;
      const path2 = beamPath2Ref.current;
      const splash = splashRef.current;
      const nodeStack = nodeStackRef.current;
      const nodeShield = nodeShieldRef.current;

      if (state === 'p1') {
        const percentage = lerp(0, 0.5, t);
        const center = percentage * 100;
        const halfWidth = 5;
        if (gradient) {
          gradient.setAttribute('x1', `${center - halfWidth}%`);
          gradient.setAttribute('x2', `${center + halfWidth}%`);
          gradient.setAttribute('y1', '0%');
          gradient.setAttribute('y2', '0%');
        }

        if (nodeStack) {
          if (percentage < 0.4) {
            nodeStack.classList.add('active');
          } else {
            nodeStack.classList.remove('active');
          }
        }

        if (t >= 1) {
          if (path1) path1.style.opacity = '0';
          if (path2) path2.style.opacity = '0';
          if (splash) {
            splash.classList.remove('animate');
            void splash.offsetWidth; // force reflow
            splash.classList.add('animate');
          }
          if (nodeStack) nodeStack.classList.remove('active');
          state = 'splash';
          lastStateChange = now;
        }
      } else if (state === 'splash') {
        if (t >= 1) {
          if (path1) path1.style.opacity = '1';
          if (path2) path2.style.opacity = '1';
          state = 'p2';
          lastStateChange = now;
        }
      } else if (state === 'p2') {
        const percentage = lerp(0.5, 1.0, t);
        const center = percentage * 100;
        const halfWidth = 5;
        if (gradient) {
          gradient.setAttribute('x1', `${center - halfWidth}%`);
          gradient.setAttribute('x2', `${center + halfWidth}%`);
          gradient.setAttribute('y1', '0%');
          gradient.setAttribute('y2', '0%');
        }

        if (nodeShield) {
          if (percentage > 0.6) {
            nodeShield.classList.add('active');
          } else {
            nodeShield.classList.remove('active');
          }
        }

        if (t >= 1) {
          if (nodeShield) nodeShield.classList.remove('active');
          state = 'idle';
          lastStateChange = now;
        }
      } else if (state === 'idle') {
        if (t >= 1) {
          state = 'p1';
          lastStateChange = now;
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    updatePath();
    const onResize = () => updatePath();
    window.addEventListener('resize', onResize);

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav>
        <span className="nav-logo">Xero</span>

        <button
          className={`menu-toggle${menuOpen ? ' active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>

        <div className={`nav-menu${menuOpen ? ' active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Method</a></li>
            <li><a href="#" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Pricing</a></li>
            <li><a href="#" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Docs</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn-login">Log in</button>
            <button className="btn-signup">Sign up</button>
          </div>
        </div>
      </nav>

      {/* ── Hero Card ──────────────────────────────────────── */}
      <section className="hero-card">
        <div className="hero-grid" aria-hidden="true" />

        {/* Icon Pipeline */}
        <div className="icon-pipeline" ref={pipelineRef}>
          {/* Beam SVG — absolutely positioned over the pipeline */}
          <svg className="beam-svg" aria-hidden="true">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient
                id="beam-gradient"
                gradientUnits="userSpaceOnUse"
                x1="-5%"
                x2="5%"
                y1="0%"
                y2="0%"
                ref={gradientRef}
              >
                <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
                <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Glow path */}
            <path
              ref={beamPath1Ref}
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              opacity="0.6"
            />
            {/* Core path */}
            <path
              ref={beamPath2Ref}
              stroke="url(#beam-gradient)"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          {/* Left node — Layers icon */}
          <div
            className="icon-node node-light-right"
            id="node-stack"
            ref={nodeStackRef}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>

          {/* Left connector line */}
          <div className="pipeline-line" aria-hidden="true" />

          {/* Center node with splash */}
          <div className="pipeline-center">
            <div className="splash" ref={splashRef} aria-hidden="true" />
            <div className="icon-node-center" id="node-x" ref={nodeXRef}>
              <XeroLogo />
            </div>
          </div>

          {/* Right connector line */}
          <div className="pipeline-line right" aria-hidden="true" />

          {/* Right node — Shield-check icon */}
          <div
            className="icon-node node-light-left"
            id="node-shield"
            ref={nodeShieldRef}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>

        {/* Hero Text */}
        <div className="hero-content">
          <h1 className="hero-heading">
            The simple way
            <strong>encryption your data</strong>
          </h1>
          <p className="hero-sub">
            Fully managed data encrypting service and annotation<br />
            platform for teams of all industries.
          </p>
          <a href="#" className="btn-cta">Get Started</a>
        </div>
      </section>

      {/* ── Brands Row ─────────────────────────────────────── */}
      <div className="brands">
        <div className="brand-item">
          <ExpediaLogo />
          <span>Expedia</span>
        </div>
        <div className="brand-item">
          <AsanaLogo />
          <span>asana</span>
        </div>
        <div className="brand-item">
          <ZenefitsLogo />
          <span>zenefits</span>
        </div>
        <div className="brand-item">
          <HubSpotLogo />
          <span>
            HubSp<span className="hubspot-dot" />t
          </span>
        </div>
        <div className="brand-item">
          <LoomLogo />
          <span>loom</span>
        </div>
      </div>
    </>
  );
}
