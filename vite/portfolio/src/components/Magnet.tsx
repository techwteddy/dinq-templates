import { useRef, useState, useEffect, ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0,0,0)');
  const [transition, setTransition] = useState(inactiveTransition);
  const isActive = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const inZone =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (inZone) {
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        if (!isActive.current) {
          isActive.current = true;
          setTransition(activeTransition);
        }
        setTransform(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
      } else if (isActive.current) {
        isActive.current = false;
        setTransition(inactiveTransition);
        setTransform('translate3d(0,0,0)');
      }
    };

    const handleMouseLeave = () => {
      if (isActive.current) {
        isActive.current = false;
        setTransition(inactiveTransition);
        setTransform('translate3d(0,0,0)');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, transition, willChange: 'transform', display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
