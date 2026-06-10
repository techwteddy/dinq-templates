import { blogs, services } from "#site/content";

export const dynamic = "force-static";

export async function GET() {
  const blogList = blogs
    .filter((b) => b.published)
    .map((b) => `- (https://famoussheamus.com${b.permalink}): ${b.description}`)
    .join("\n");

  const serviceList = services
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .map((s) => `- (https://famoussheamus.com${s.permalink}): ${s.description}`)
    .join("\n");

  const content = `# Famous Sheamus Consulting
> AI Implementation Consultant & Fractional CTO providing technical leadership and automation architecture for high-growth enterprises.

About
Specialized in building resilient AI systems (n8n, Vapi, OpenAI) and revenue-scaling frameworks. Global Delivery & On-site Consulting available.

Primary Resources
- (https://famoussheamus.com/llms-full.txt): A comprehensive version of all site content for deep context ingestion.

Services
${serviceList}

Knowledge Base & Articles
${blogList}

Contact & Metadata
- Email: sheamus@famoussheamus.com
- (https://famoussheamus.com/sitemap.xml)`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200"
    },
  });
}
