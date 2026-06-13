import { defineField, defineType } from 'sanity';

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled Partner',
        media,
      }
    }
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
});