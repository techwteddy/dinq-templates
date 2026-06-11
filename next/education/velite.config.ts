import { defineConfig, s } from 'velite';

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: {
    authors: {
      name: 'Author',
      pattern: 'authors/**/*.md',
      schema: s.object({
        id: s.string(),
        name: s.string(),
        role: s.string(),
        department: s.string(),
        bio: s.string(),
        image: s.string(),
        socials: s
          .object({
            twitter: s.string().optional(),
            github: s.string().optional(),
            linkedin: s.string().optional(),
            website: s.string().optional(),
          })
          .optional(),
      }),
    },
    courses: {
      name: 'Course',
      pattern: 'courses/**/*.mdx',
      schema: s
        .object({
          id: s.string(),
          title: s.string(),
          description: s.string(),
          price: s.number(),
          image: s.string(),
          category: s.string(),
          level: s.enum(['Beginner', 'Intermediate', 'Advanced']),
          instructorId: s.string(), // Integrity: Must match an author id
          published: s.boolean().default(true),
          duration: s.string(),
          syllabus: s.array(
            s.object({
              id: s.string(),
              title: s.string(),
              lessons: s.array(
                s.object({
                  id: s.string(),
                  title: s.string(),
                  duration: s.string().optional(),
                })
              ),
            })
          ),
          content: s.mdx(),
        })
        .transform((data) => ({ ...data, slug: data.id.toLowerCase() })),
    },
    reviews: {
      name: 'Review',
      pattern: 'reviews/**/*.json',
      schema: s.object({
        id: s.string(),
        courseId: s.string(),
        author: s.string(),
        rating: s.number().min(1).max(5),
        comment: s.string(),
        date: s.isodate(),
      }),
    },
    posts: {
      name: 'Post',
      pattern: 'blog/**/*.mdx',
      schema: s
        .object({
          title: s.string(),
          description: s.string(),
          date: s.isodate(),
          image: s.string(),
          authorId: s.string(),
          categoryId: s.string(),
          published: s.boolean().default(true),
          tags: s.array(s.string()).default([]),
          content: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          slug: data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-'),
        })),
    },
  },
});
