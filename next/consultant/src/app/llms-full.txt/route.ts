import { blogs, services } from "#site/content";

export const dynamic = "force-static";

function cleanMdx(content: string) {
  return content
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, "") // Remove self-closing components
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "") // Remove paired components
    .replace(/import\s+.*\s+from\s+['"].*['"];?/g, "") // Remove imports
    .replace(/export\s+default\s+.*;/g, "") // Remove exports
    .trim();
}

export async function GET() {
  const blogFull = blogs
    .filter((b) => b.published)
    .map((b) => {
      return `### ${b.title}\nURL: https://famoussheamus.com${b.permalink}\nDescription: ${b.description}\n\n${cleanMdx(b.body)}\n\n---`;
    })
    .join("\n\n");

  const serviceFull = services
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .map((s) => {
      return `### ${s.title}\nURL: https://famoussheamus.com${s.permalink}\nDescription: ${s.description}\n\n${cleanMdx(s.body)}\n\n---`;
    })
    .join("\n\n");

  const content = `# Famous Sheamus Consulting - Full Site Content
This document provides a comprehensive overview of Famous Sheamus Consulting, including our core philosophy, services, and technical insights.

## Core Philosophy: Scale Revenue, Not Chaos
Famous Sheamus Consulting is an AI Architecture firm providing Fractional CTO services for high-growth enterprises. Specializing in n8n automation, Vapi, OpenAI integrations, and custom LLM infrastructure, we deliver resilient technical leadership and "No New Software" architectures. Global Delivery and On-site Consulting are available worldwide for high-stakes audits and implementation.

## About Sheamus
Sheamus is a Fractional CTO and AI Architect with over a decade of experience in the technology sector. His journey evolved from foundational roles in IT support and systems engineering to leading strategic software initiatives and complex operations for companies like prototype:IT and Makeready. He specializes in AI-driven automation using tools like n8n and Large Language Models (LLMs) to bridge the gap between technical complexity and scalable business growth.

---

## Technical Articles & Journal
${blogFull}

---

## Consulting Services
${serviceFull}

---

## Contact
Email: sheamus@famoussheamus.com
Website: https://famoussheamus.com
Sitemap: https://famoussheamus.com/sitemap.xml`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200"
    },
  });
}
