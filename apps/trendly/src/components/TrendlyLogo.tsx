type Props = { dark?: boolean; size?: number };
export function TrendlyLogo({ dark, size = 48 }: Props) {
  return (
    <span
      style={{
        fontFamily: "var(--font-script)",
        fontSize: size,
        lineHeight: 1,
        color: dark ? "#111" : "#fff",
        textShadow: dark ? "2px 3px 0 rgba(0,0,0,0.15)" : "none",
      }}
    >
      Trendly
    </span>
  );
}

/**
 * Compact "T" icon variant — used in tight spots (favicon, splash, app icon,
 * tab bars). Filled with the brand gradient inside a rounded square.
 */
export function TrendlyIcon({ size = 32 }: { size?: number }) {
  const r = Math.max(6, Math.round(size * 0.22));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Trendly"
    >
      <defs>
        <linearGradient id="trendlyGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff7a45" />
          <stop offset="50%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#7209b7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx={r} ry={r} fill="url(#trendlyGrad)" />
      <text
        x="32"
        y="50"
        fontFamily="var(--font-script), 'Grand Hotel', cursive"
        fontSize="56"
        fontWeight="400"
        fill="#fff"
        textAnchor="middle"
      >
        T
      </text>
    </svg>
  );
}
