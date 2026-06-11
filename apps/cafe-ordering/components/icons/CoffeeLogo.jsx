export default function CoffeeLogo({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Steam */}
      <path
        d="M26 14C24 10 26 8 28 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M34 14C32 10 34 8 36 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M42 14C40 10 42 8 44 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Cup */}
      <path
        d="M16 22H44V40C44 46 38 50 30 50C22 50 16 46 16 40V22Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cup Handle */}
      <path
        d="M44 26H48C52 26 54 28 54 32C54 36 52 38 48 38H44"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Saucer */}
      <path
        d="M14 54H46"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
