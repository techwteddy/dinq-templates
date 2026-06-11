export default function ChooseDrinkIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cup */}
      <path
        d="M18 22H38V40C38 44 35 47 31 47H25C21 47 18 44 18 40V22Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Lid */}
      <path
        d="M16 22H40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Straw */}
      <path
        d="M30 14V22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
