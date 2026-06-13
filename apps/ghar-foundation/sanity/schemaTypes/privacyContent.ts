import { defineField, defineType } from 'sanity';

export const privacyContent = defineType({
  name: 'privacyContent',
  title: 'Privacy Policy',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Privacy Policy' }
    }
  },
  fields: [
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'string',
    }),
    defineField({
      name: 'contentEn',
      title: 'Content — English',
      type: 'text',
      rows: 20,
    }),
    defineField({
      name: 'contentAr',
      title: 'Content — Arabic',
      type: 'text',
      rows: 20,
    }),
    defineField({
      name: 'contentDe',
      title: 'Content — German',
      type: 'text',
      rows: 20,
    }),
  ],
});