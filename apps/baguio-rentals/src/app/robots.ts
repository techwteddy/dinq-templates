import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/messages/", "/my-listings/", "/saved/", "/onboarding/", "/profile/"],
    },
    sitemap: "https://baguiorentals.com/sitemap.xml",
  };
}
