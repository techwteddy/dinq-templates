// App Router metadata file — Next.js serialises this to /sitemap.xml at build time.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brewbite.vercel.app";
  const now = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
