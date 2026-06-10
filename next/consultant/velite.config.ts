import { defineConfig, s } from "velite";

const blogs = {
  name: "Blog",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(),
      description: s.string().max(500), // The "2-sentence summary" rule 
      category: s.string().default("Uncategorized"),
      date: s.isodate(),
      published: s.boolean().default(true),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/blog/${data.slug.split("/").pop()}`,
      filePath: `content/${data.slug}.mdx`,
    })),
};

const services = {
  name: "Service",
  pattern: "services/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(),
      description: s.string(),
      isFeatured: s.boolean().default(false),
      order: s.number(),
      icon: s.string().optional(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/services/${data.slug.split("/").pop()}`,
      filePath: `content/${data.slug}.mdx`,
    })),
};

const pages = {
  name: "Page",
  pattern: "pages/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(),
      description: s.string().max(500),
      published: s.boolean().default(true),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.slug.split("/").pop()}`,
      filePath: `content/${data.slug}.mdx`,
    })),
};

const caseStudies = {
  name: "CaseStudy",
  pattern: "case-studies/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(),
      description: s.string().max(500),
      companyName: s.string(),
      companyUrl: s.string().url(),
      brandColor: s.string().regex(/^#[0-9A-F]{6}$/i),
      accentColor: s.string().regex(/^#[0-9A-F]{6}$/i),
      logoPath: s.string().optional(),
      stats: s.array(s.string()),
      clientReference: s.object({
        name: s.string(),
        title: s.string(),
        linkedin: s.string().url().optional(),
        image: s.string().optional(),
      }).optional(),
      roleTitle: s.string().optional(),
      roleDescription: s.string().optional(),
      heroImage: s.string().optional(),
      showTechnicalSchematic: s.boolean().default(false),
      published: s.boolean().default(true),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/case-studies/${data.slug.split("/").pop()}`,
      filePath: `content/${data.slug}.mdx`,
    })),
};

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blogs, services, pages, caseStudies },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
});
