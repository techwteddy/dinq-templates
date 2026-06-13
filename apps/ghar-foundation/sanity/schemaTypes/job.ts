import { defineField, defineType } from 'sanity';

export const job = defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'type',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title || 'Untitled Job',
        subtitle: `${subtitle || ''} ${active ? '✅' : '❌'}`,
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
      name: 'type',
      title: 'Job Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Volunteer', value: 'volunteer' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'applyEmail',
      title: 'Apply Email',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
});