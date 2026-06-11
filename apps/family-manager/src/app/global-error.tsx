"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: "#fdf8f4", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ padding: "2rem", borderRadius: "1rem", backgroundColor: "white", border: "2px solid #e5e0db", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", maxWidth: "28rem", width: "100%" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Something went wrong</h2>
            <p style={{ fontSize: "0.875rem", color: "#8a8178", marginBottom: "1.5rem" }}>
              {error.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={reset}
              style={{ padding: "0.625rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "#8b7ec8", color: "white", fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
