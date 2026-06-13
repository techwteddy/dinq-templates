import { defineField, defineType } from 'sanity';

export const jobsPage = defineType({
  name: 'jobsPage',
  title: 'Jobs Page',
  type: 'document',
  preview: { prepare() { return { title: 'Jobs Page' } } },
  fields: [
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'object', fields: [
      { name: 'en', title: 'English', type: 'string' },
      { name: 'ar', title: 'Arabic', type: 'string' },
      { name: 'de', title: 'German', type: 'string' },
    ]}),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'object', fields: [
      { name: 'en', title: 'English', type: 'string' },
      { name: 'ar', title: 'Arabic', type: 'string' },
      { name: 'de', title: 'German', type: 'string' },
    ]}),
  ],
});