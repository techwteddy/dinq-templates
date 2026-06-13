import { defineField, defineType } from 'sanity';

export const homeContent = defineType({
  name: 'homeContent',
  title: 'Home Content',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Home Content' }
    }
  },
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      description: 'Inspirational quote displayed between Projects and Stats sections',
      fields: [
        { name: 'en', title: 'English', type: 'text', rows: 3 },
        { name: 'ar', title: 'Arabic', type: 'text', rows: 3 },
        { name: 'de', title: 'German', type: 'text', rows: 3 },
      ],
    }),
  ],
});