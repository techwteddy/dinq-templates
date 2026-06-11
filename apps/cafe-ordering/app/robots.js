// App Router metadata file — Next.js serialises this to /robots.txt at build time.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brewbite.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Exclude cart and order pages — no value in indexing these.
        disallow: ["/cart", "/order/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
