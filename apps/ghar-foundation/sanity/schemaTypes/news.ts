import { defineField, defineType } from 'sanity';
export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled News',
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
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt text' },
                { name: 'caption', type: 'string', title: 'Caption' },
              ],
            },
          ],
        },
        {
          name: 'ar',
          title: 'Arabic',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt text' },
                { name: 'caption', type: 'string', title: 'Caption' },
              ],
            },
          ],
        },
        {
          name: 'de',
          title: 'German',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt text' },
                { name: 'caption', type: 'string', title: 'Caption' },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
  ],
});