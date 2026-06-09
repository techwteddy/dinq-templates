import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(#n)' opacity='0.08'/></svg>`;
const GRAIN_URI = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

const TRANSITION = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)';

function getRoleStyle(role: 'center' | 'left' | 'right' | 'back', isMobile: boolean): React.CSSProperties {
  if (role === 'center') {
    return {
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
      filter: 'none',
      opacity: 1,
      zIndex: 20,
      left: '50%',
      height: isMobile ? '60%' : '92%',
      bottom: isMobile ? '22%' : 0,
    };
  }
  if (role === 'left') {
    return {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)',
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? '20%' : '30%',
      height: isMobile ? '16%' : '28%',
      bottom: isMobile ? '32%' : '12%',
    };
  }
  if (role === 'right') {
    return {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)',
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? '80%' : '70%',
      height: isMobile ? '16%' : '28%',
      bottom: isMobile ? '32%' : '12%',
    };
  }
  // back
  return {
    transform: 'translateX(-50%) scale(1)',
    filter: 'blur(4px)',
    opacity: 1,
    zIndex: 5,
    left: '50%',
    height: isMobile ? '13%' : '22%',
    bottom: isMobile ? '32%' : '12%',
  };
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => setIsAnimating(false), 650);
  };

  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;
  const back = (activeIndex + 2) % 4;

  const roleOf = (i: number): 'center' | 'left' | 'right' | 'back' => {
    if (i === center) return 'center';
    if (i === left) return 'left';
    if (i === right) return 'right';
    return 'back';
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'Inter, sans-serif',
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 50,
            backgroundImage: GRAIN_URI,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: 0.4,
          }}
        />

        {/* Ghost text */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            top: '18%',
            bottom: 'auto',
          }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* Brand label */}
        <div
          style={{ position: 'absolute', top: 24, left: isMobile ? 16 : 32, zIndex: 60 }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'white',
              opacity: 0.9,
              letterSpacing: '0.18em',
            }}
          >
            TOONHUB
          </span>
        </div>

        {/* Carousel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {IMAGES.map((img, i) => {
            const role = roleOf(i);
            const roleStyle = getRoleStyle(role, isMobile);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition: TRANSITION,
                  willChange: 'transform, filter, opacity',
                  ...roleStyle,
                }}
              >
                <img
                  src={img.src}
                  alt={`Character ${i + 1}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left: text + nav */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? 24 : 80,
            left: isMobile ? 16 : 96,
            zIndex: 60,
            maxWidth: 320,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: isMobile ? 8 : 12,
              fontSize: isMobile ? '1rem' : '22px',
              color: 'white',
              opacity: 0.95,
            }}
          >
            TOONHUB FIGURINES
          </p>
          {!isMobile && (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'white',
                opacity: 0.85,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
            </p>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            {(['prev', 'next'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                style={{
                  width: isMobile ? 48 : 64,
                  height: isMobile ? 48 : 64,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 150ms, background-color 150ms',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
                aria-label={dir === 'prev' ? 'Previous' : 'Next'}
              >
                {dir === 'prev'
                  ? <ArrowLeft size={26} strokeWidth={2.25} />
                  : <ArrowRight size={26} strokeWidth={2.25} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-right: discover link */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? 24 : 80,
            right: isMobile ? 16 : 40,
            zIndex: 60,
          }}
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: 'white',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95'}
          >
            DISCOVER IT
            <ArrowRight
              style={{ width: isMobile ? 20 : 32, height: isMobile ? 20 : 32 }}
              strokeWidth={2.25}
            />
          </a>
        </div>

      </div>
    </div>
  );
}
