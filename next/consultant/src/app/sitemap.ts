import { MetadataRoute } from "next";
import { blogs, services } from "#site/content";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://famoussheamus.com";

  // Helper to get actual file modification time
  // 'filePath' should be relative to the project root, e.g., 'content/blog/my-post.md'
  const getFileTimestamp = (relativeFilePath: string) => {
    try {
      const fullPath = path.join(process.cwd(), relativeFilePath);
      const stats = fs.statSync(fullPath);
      return stats.mtime;
    } catch {
      return new Date(); // Fallback to current date if file not found
    }
  };

  // 1. Core static pages
  // Note: Point these to the actual file locations in your /app directory
  const staticPages = [
    { route: "", file: "src/app/page.tsx" },
    { route: "/about", file: "src/app/about/page.tsx" },
    { route: "/services", file: "src/app/services/page.tsx" },
    { route: "/case-studies", file: "src/app/case-studies/page.tsx" },
    { route: "/blog", file: "src/app/blog/page.tsx" },
    { route: "/contact", file: "src/app/contact/page.tsx" },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: getFileTimestamp(item.file),
    changeFrequency: "monthly" as const,
    priority: item.route === "" ? 1 : 0.8,
  }));

  // 2. Dynamic Service pages
  const servicePages = services.map((service) => ({
    url: `${baseUrl}${service.permalink}`,
    // Velite often provides 'service._raw.sourceFilePath' 
    // Adjust the property name based on your specific Velite config
    lastModified: getFileTimestamp(service.filePath),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic Blog pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}${blog.permalink}`,
    // Use the date you manually set in your markdown file
    lastModified: new Date(blog.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}