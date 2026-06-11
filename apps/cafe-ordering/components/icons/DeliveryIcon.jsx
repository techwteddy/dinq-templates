export default function DeliveryIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Truck body */}
      <path
        d="M10 36V26C10 24 12 22 14 22H36V36H10Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Cabin */}
      <path
        d="M36 26H46L52 32V36H36V26Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Wheels */}
      <circle cx="20" cy="40" r="3.5" stroke="currentColor" strokeWidth="3" />
      <circle cx="44" cy="40" r="3.5" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
