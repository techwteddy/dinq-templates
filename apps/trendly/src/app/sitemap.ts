import type { MetadataRoute } from "next";

// Firebase App Hosting sets this to your live origin automatically.
// Fallback is a placeholder — override in env when you have a domain.
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trendly.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/feed", "/reels", "/search", "/privacy"];
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/reels" || path === "/feed" ? "hourly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
