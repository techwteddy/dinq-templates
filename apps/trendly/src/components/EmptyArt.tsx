/**
 * Abstract gradient-blob illustration for empty states.
 * 3 overlapping blurred circles in brand colors with mix-blend-mode: screen.
 * Drop-in replacement for the previous "circle + emoji + lucide icon" combo.
 */
type Props = { size?: number; className?: string };

export function EmptyArt({ size = 120, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden
      className={className}
    >
      <defs>
        <filter id="emptyBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g filter="url(#emptyBlur)" style={{ mixBlendMode: "screen" }}>
        <circle cx="42" cy="50" r="32" fill="#ff7a45" opacity="0.85" />
        <circle cx="78" cy="48" r="34" fill="#f72585" opacity="0.85" />
        <circle cx="60" cy="78" r="30" fill="#7209b7" opacity="0.85" />
      </g>
    </svg>
  );
}
