export const siteConfig = {
  name: 'EduPlatform',
  description:
    'A comprehensive education platform template for courses, faculty, and blog.',
  url: 'https://eduplatform.example.com',
  ogImage: 'https://eduplatform.example.com/og-image.jpg',
  mainNav: [
    {
      title: 'Courses',
      href: '/courses',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Faculty',
      href: '/faculty',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ],
  links: {
    twitter: 'https://twitter.com/eduplatform',
    github: 'https://github.com/eduplatform/template',
  },
  demoPaths: ['/enroll'],
};

export type SiteConfig = typeof siteConfig;
