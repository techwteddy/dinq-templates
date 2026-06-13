import { defineField, defineType } from 'sanity';

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  preview: {
    select: {
      title: 'title.en',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled Slide',
        media,
      }
    }
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'ar', title: 'Arabic', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
      ],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'ar', title: 'Arabic', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
});