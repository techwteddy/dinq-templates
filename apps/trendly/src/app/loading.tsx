import { TrendlyIcon } from "@/components/TrendlyLogo";

/**
 * Root splash — shown while Next routes the user from / to /feed or /switch.
 * Uses CSS animation defined in globals.css for the gradient sweep.
 */
export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 z-50">
      <div className="splash-icon">
        <TrendlyIcon size={88} />
      </div>
      <span
        className="brand-text font-semibold text-lg tracking-wide"
        style={{ fontFamily: "var(--font-script)" }}
      >
        Trendly
      </span>
    </div>
  );
}
