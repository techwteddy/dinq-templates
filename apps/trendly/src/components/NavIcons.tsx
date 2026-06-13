/**
 * Filled, gradient-aware SVG icons for the 5 bottom-nav active states.
 * Use the existing #brandGrad <linearGradient> defined inside BottomNav.
 * Each icon accepts a `size` prop and is intended to be used as the
 * "active" alternative to its Lucide outline counterpart.
 */
type Props = { size?: number };

export function HomeFill({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M11.3 2.6 3.6 9.1c-.4.3-.6.7-.6 1.2V20a2 2 0 0 0 2 2h4a1 1 0 0 0 1-1v-5a2 2 0 1 1 4 0v5a1 1 0 0 0 1 1h4a2 2 0 0 0 2-2v-9.7c0-.5-.2-.9-.6-1.2L12.7 2.6a1.1 1.1 0 0 0-1.4 0Z"
        fill="url(#brandGrad)"
      />
    </svg>
  );
}

export function ZapFill({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M13.5 2.5c.4-.6 1.4-.4 1.4.4V10h4.4c.6 0 1 .7.6 1.2l-9 11.4c-.4.5-1.3.2-1.3-.5V14H4.7c-.6 0-1-.7-.6-1.2l9.4-10.3Z"
        fill="url(#brandGrad)"
      />
    </svg>
  );
}

export function PlusFill({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#brandGrad)" />
      <path
        d="M12 7v10M7 12h10"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartFill({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-8-5.2-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.8-8 11-8 11h-2Z"
        transform="translate(-1 -1)"
        fill="url(#brandGrad)"
      />
    </svg>
  );
}
