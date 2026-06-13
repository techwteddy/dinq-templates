import { MetadataRoute } from 'next';

const baseUrl = 'https://www.ghar-ngo.com';
const locales = ['en', 'ar', 'de'];

const staticPages = [
  '',
  '/about',
  '/projects',
  '/news',
  '/donate',
  '/volunteer',
  '/jobs',
  '/contact',
  '/transparency',
  '/privacy',
  '/impressum',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page === '/projects' || page === '/donate' ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}