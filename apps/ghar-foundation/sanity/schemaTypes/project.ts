import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'countryCode',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Project',
        subtitle: subtitle || '',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
    }),
    defineField({
      name: 'countryCode',
      title: 'Country Code',
      type: 'string',
      description: 'ISO code e.g. SD, YE, PS',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'raised',
      title: 'Amount Raised (€)',
      type: 'number',
    }),
    defineField({
      name: 'goal',
      title: 'Goal Amount (€)',
      type: 'number',
    }),
    defineField({
      name: 'desc',
      title: 'Short Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'details',
      title: 'Full Details',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'impact',
      title: 'Impact Points',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});