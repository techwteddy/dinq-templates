import { defineField, defineType } from 'sanity';

export const transparencyContent = defineType({
  name: 'transparencyContent',
  title: 'Transparency Content',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'Transparency Content' }
    }
  },
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'ar', title: 'Arabic', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
      ],
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'ar', title: 'Arabic', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
      ],
    }),

    // ===== ALLOCATIONS =====
    defineField({
      name: 'allocations',
      title: 'Fund Allocations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'object', fields: [
              { name: 'en', title: 'English', type: 'string' },
              { name: 'ar', title: 'Arabic', type: 'string' },
              { name: 'de', title: 'German', type: 'string' },
            ]},
            { name: 'percentage', title: 'Percentage', type: 'number' },
            { name: 'color', title: 'Color (hex)', type: 'string' },
          ],
        },
      ],
    }),

    // ===== REPORTS =====
    defineField({
      name: 'reports',
      title: 'Financial Reports',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'title', title: 'Title', type: 'object', fields: [
              { name: 'en', title: 'English', type: 'string' },
              { name: 'ar', title: 'Arabic', type: 'string' },
              { name: 'de', title: 'German', type: 'string' },
            ]},
            { name: 'file', title: 'PDF File', type: 'file' },
            { name: 'size', title: 'File Size (e.g. 2.4 MB)', type: 'string' },
          ],
        },
      ],
    }),

    // ===== GOVERNANCE =====
    defineField({
      name: 'governance',
      title: 'Governance Structure',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', title: 'Role', type: 'object', fields: [
              { name: 'en', title: 'English', type: 'string' },
              { name: 'ar', title: 'Arabic', type: 'string' },
              { name: 'de', title: 'German', type: 'string' },
            ]},
            { name: 'name', title: 'Full Name', type: 'string' },
            { name: 'responsibility', title: 'Responsibility', type: 'object', fields: [
              { name: 'en', title: 'English', type: 'string' },
              { name: 'ar', title: 'Arabic', type: 'string' },
              { name: 'de', title: 'German', type: 'string' },
            ]},
          ],
        },
      ],
    }),

    // ===== CERTIFICATIONS =====
    defineField({
      name: 'certifications',
      title: 'Certifications & Registration',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'object', fields: [
              { name: 'en', title: 'English', type: 'string' },
              { name: 'ar', title: 'Arabic', type: 'string' },
              { name: 'de', title: 'German', type: 'string' },
            ]},
            { name: 'body', title: 'Issuing Body', type: 'string' },
            { name: 'year', title: 'Year', type: 'string' },
          ],
        },
      ],
    }),

    // ===== EFFICIENCY =====
    defineField({
      name: 'efficiencyPercentage',
      title: 'Efficiency Percentage (e.g. 75)',
      type: 'number',
      initialValue: 75,
    }),
  ],
});