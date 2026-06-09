interface LiveProjectButtonProps {
  href?: string;
  className?: string;
}

export default function LiveProjectButton({ href = '#', className }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 inline-block text-center ${className ?? ''}`}
      style={{ fontFamily: 'inherit' }}
    >
      Live Project
    </a>
  );
}
