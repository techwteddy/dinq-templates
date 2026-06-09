import { useRef, CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((char, i) => (
        <CharSpan
          key={i}
          char={char}
          start={i / chars.length}
          end={(i + 1) / chars.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}

interface CharSpanProps {
  char: string;
  start: number;
  end: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function CharSpan({ char, start, end, scrollYProgress }: CharSpanProps) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ opacity: 0 }}>{char}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>
        {char}
      </motion.span>
    </span>
  );
}
