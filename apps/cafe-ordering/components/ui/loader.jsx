import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ text = "Brewing your order...", fullscreen = true }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullscreen && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      )}
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center">
        <Coffee className="h-10 w-10 text-orange-500 animate-bounce" />
      </div>

      {/* Text */}
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  );
}
