'use client';
// src/components/nutrition/ConfidenceDot.tsx
import type { ConfidenceLevel } from '@/types/nutrition';
import { CONFIDENCE_COLORS } from '@/types/nutrition';

interface ConfidenceDotProps {
  level: ConfidenceLevel;
  showLabel?: boolean;
}

export function ConfidenceDot({ level, showLabel = false }: ConfidenceDotProps) {
  const LABELS: Record<ConfidenceLevel, string> = {
    HIGH: 'Alta precisión',
    MEDIUM: 'Precisión media',
    LOW: 'Estimado',
  };

  return (
    <span className="confidence-dot" title={LABELS[level]}>
      <span
        className="confidence-dot__circle"
        style={{ background: CONFIDENCE_COLORS[level] }}
      />
      {showLabel && (
        <span className="confidence-dot__label" style={{ color: CONFIDENCE_COLORS[level] }}>
          {LABELS[level]}
        </span>
      )}
      <style jsx>{`
        .confidence-dot { display: inline-flex; align-items: center; gap: 0.3rem; }
        .confidence-dot__circle {
          width: 0.5rem; height: 0.5rem; border-radius: 50%; flex-shrink: 0;
        }
        .confidence-dot__label { font-size: 0.7rem; font-weight: 500; }
      `}</style>
    </span>
  );
}
