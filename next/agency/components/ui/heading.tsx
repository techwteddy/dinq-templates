import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
  size?: "large" | "medium";
  id?: string;
};

export default function SectionHeading({
  children,
  size = "large",
  id,
}: SectionHeadingProps) {
  const sizeClasses = size === "large" ? "text-3xl" : "text-2xl";
  return (
    <h2
      id={id}
      className={`${sizeClasses} font-medium capitalize mb-8 text-center className="mb-20 w-full overflow-hidden"`}
    >
      {children}
    </h2>
  );
}
