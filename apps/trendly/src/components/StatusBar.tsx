import { Signal, Wifi, BatteryFull } from "lucide-react";

export function StatusBar() {
  return (
    <div className="status-bar text-white">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2.5} />
      </span>
    </div>
  );
}
