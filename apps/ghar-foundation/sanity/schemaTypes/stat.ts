import { defineField, defineType } from 'sanity';

export const stat = defineType({
  name: 'stat',
  title: 'Statistic',
  type: 'document',
  preview: {
    select: {
      number: 'number',
      label: 'label.en',
    },
    prepare({ number, label }) {
      return {
        title: label || 'Untitled Stat',
        subtitle: number ? `${number.toLocaleString()}+` : '',
      }
    }
  },
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'ar', title: 'Arabic', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
});