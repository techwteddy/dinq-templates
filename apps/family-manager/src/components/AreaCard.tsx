import Link from "next/link";
import type { NavArea } from "@/config/navigation";

const AREA_COLORS: Record<string, string> = {
  "/calendar": "from-lavender/25 to-card border-lavender/50 hover:border-lavender/70",
  "/supermarket": "from-sage/25 to-card border-sage/50 hover:border-sage/70",
  "/chores": "from-peach/25 to-card border-peach/50 hover:border-peach/70",
  "/home-projects": "from-honey/25 to-card border-honey/50 hover:border-honey/70",
  "/school-tests": "from-rose/25 to-card border-rose/50 hover:border-rose/70",
  "/messages": "from-teal/25 to-card border-teal/50 hover:border-teal/70",
};

export default function AreaCard({ area }: { area: NavArea }) {
  const colors = AREA_COLORS[area.href] ?? "from-card to-card border-card-border";

  return (
    <Link
      href={area.href}
      className={`flex items-start gap-4 rounded-2xl border-2 bg-gradient-to-br p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${colors}`}
    >
      <span className="text-3xl">{area.icon}</span>
      <div>
        <h2 className="font-semibold text-lg text-foreground">{area.name}</h2>
        <p className="text-sm text-muted">{area.description}</p>
      </div>
    </Link>
  );
}
