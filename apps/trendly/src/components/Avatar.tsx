import Image from "next/image";
import { cn, avatarFor } from "@/lib/utils";

type Props = {
  username: string;
  avatarUrl?: string | null;
  size?: number;
  ring?: "story" | "viewed" | "live" | "none";
  className?: string;
};

export function Avatar({ username, avatarUrl, size = 40, ring = "none", className }: Props) {
  const src = avatarFor(username, avatarUrl);
  const padding = ring === "story" || ring === "live" ? 3 : ring === "viewed" ? 2 : 0;
  const wrapperStyle = { width: size, height: size };
  const imgSize = size - padding * 2 - (ring !== "none" ? 4 : 0);

  return (
    <div
      className={cn(
        "relative rounded-full inline-flex items-center justify-center",
        ring === "story" && "story-ring",
        ring === "viewed" && "story-ring viewed",
        ring === "live" && "story-ring",
        className,
      )}
      style={wrapperStyle}
    >
      <div
        className={cn(
          "rounded-full overflow-hidden bg-[color:var(--color-bg-elev)]",
          ring !== "none" && "border-2 border-black",
        )}
        style={{ width: imgSize + 4, height: imgSize + 4 }}
      >
        <Image
          src={src}
          alt={username}
          width={imgSize}
          height={imgSize}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
      {ring === "live" && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 live-badge text-[10px] font-bold px-1.5 py-0.5 rounded text-white">
          LIVE
        </span>
      )}
    </div>
  );
}
