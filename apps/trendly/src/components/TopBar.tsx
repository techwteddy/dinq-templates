"use client";
import Link from "next/link";
import { ChevronLeft, Camera, Heart, Send, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  logo?: boolean;
  back?: boolean | string;
  right?: React.ReactNode;
  left?: React.ReactNode;
};

export function TopBar({ title, logo, back, right, left }: Props) {
  return (
    <header className="sticky top-0 z-30 glass-top">
      <div className="h-12 px-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-10">
          {back && (
            <Link href={typeof back === "string" ? back : ".."} aria-label="Back">
              <ChevronLeft size={28} />
            </Link>
          )}
          {left}
        </div>
        <div className="flex-1 flex items-center justify-center">
          {logo ? (
            <span style={{ fontFamily: "var(--font-script)" }} className="text-3xl leading-none">
              Trendly
            </span>
          ) : (
            <span className="text-base font-semibold">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-4 justify-end min-w-10">{right}</div>
      </div>
    </header>
  );
}

export const TopBarIcons = { Camera, Heart, Send, Menu, Plus };

export function IconBtn({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("p-1 -m-1 text-white active:opacity-60", className)}
    >
      {children}
    </button>
  );
}
