"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import t from "@/lib/translations";

export default function SkillsRadar() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const tr = t[lang].skills;
  const isLight = theme === "light";

  return (
    <div className="mt-16">
      <h3
        className="text-2xl font-semibold text-center mb-8"
        style={{ color: "var(--color-heading)" }}
      >
        {tr.radarTitle}
      </h3>
      <div
        className="max-w-lg mx-auto rounded-xl p-3 sm:p-6 w-full"
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={tr.radarData}>
            <PolarGrid stroke={isLight ? "rgba(15,23,42,0.25)" : "rgba(255,255,255,0.2)"} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: isLight ? "#334155" : "#9ca3af", fontSize: 13, fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                background: isLight ? "rgba(248,250,252,0.97)" : "rgba(15,23,42,0.9)",
                border: `1px solid ${isLight ? "rgba(148,163,184,0.5)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: "8px",
                color: isLight ? "#0f172a" : "#d1d5db",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
            <Radar
              dataKey="value"
              stroke={isLight ? "#0f766e" : "#14b8a6"}
              fill={isLight ? "#0f766e" : "#14b8a6"}
              fillOpacity={0.25}
              dot={{ fill: isLight ? "#0f766e" : "#14b8a6", r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
