import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fernando Ghiberti — Senior Fullstack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative accent blob */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, #14b8a6, transparent 70%)",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, #3b82f6, transparent 70%)",
            opacity: 0.2,
          }}
        />

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 36,
            gap: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/ghiberti85.png"
            width={96}
            height={96}
            style={{ borderRadius: "50%", border: "3px solid #14b8a6" }}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#94a3b8", fontSize: 20, letterSpacing: 2 }}>
              ghiberti85.vercel.app
            </span>
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(135deg, #14b8a6, #3b82f6)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Fernando Ghiberti
        </div>

        {/* Role */}
        <div style={{ fontSize: 30, color: "#e2e8f0", marginBottom: 40, fontWeight: 500 }}>
          Senior Fullstack Developer
        </div>

        {/* Tech chips */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["React", "Next.js", "TypeScript", "Node.js", "Supabase", "AI"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "6px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#94a3b8",
                fontSize: 18,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
