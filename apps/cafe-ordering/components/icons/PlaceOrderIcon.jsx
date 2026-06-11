export default function PlaceOrderIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Paper */}
      <path
        d="M18 10H38L46 18V50C46 52 44 54 42 54H18C16 54 14 52 14 50V14C14 12 16 10 18 10Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Fold */}
      <path
        d="M38 10V18H46"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Hand / Finger */}
      <path
        d="M30 30V42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M30 42L34 38"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
