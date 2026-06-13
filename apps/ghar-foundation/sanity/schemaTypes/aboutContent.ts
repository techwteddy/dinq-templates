import { defineField, defineType } from 'sanity';

const iconOptions = [
  { title: '❤️ Heart — المحبة', value: 'Heart' },
  { title: '🛡️ Shield — الحماية', value: 'Shield' },
  { title: '👁️ Eye — الشفافية', value: 'Eye' },
  { title: '🤝 Handshake — التعاون', value: 'Handshake' },
  { title: '⭐ Star — التميز', value: 'Star' },
  { title: '🌍 Globe — العالمية', value: 'Globe' },
  { title: '🏠 Home — المأوى', value: 'Home' },
  { title: '🌱 Leaf — الاستدامة', value: 'Leaf' },
  { title: '⚖️ Scale — العدالة', value: 'Scale' },
  { title: '🕊️ Dove — السلام', value: 'Smile' },
  { title: '💡 Lightbulb — الابتكار', value: 'Lightbulb' },
  { title: '🙏 Users — المجتمع', value: 'Users' },
  { title: '🎯 Target — الهدف', value: 'Target' },
  { title: '💪 Zap — القوة', value: 'Zap' },
  { title: '🌟 Award — الجائزة', value: 'Award' },
  { title: '🔒 Lock — الأمان', value: 'Lock' },
  { title: '📋 Clipboard — المساءلة', value: 'ClipboardList' },
  { title: '🌐 Network — الشبكة', value: 'Network' },
]

export const aboutContent = defineType({
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  preview: {
    prepare() {
      return { title: 'About Content' }
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
    defineField({
      name: 'storyImage',
      title: 'Story Image (Our Story Section)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'story1',
      title: 'Story Paragraph 1',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'story2',
      title: 'Story Paragraph 2',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'story3',
      title: 'Story Paragraph 3',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'mission',
      title: 'Mission',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'vision',
      title: 'Vision',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'ar', title: 'Arabic', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: {
            select: { title: 'title.en', subtitle: 'icon' },
            prepare({ title, subtitle }) {
              return { title: title || 'Untitled Value', subtitle }
            }
          },
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: iconOptions,
                layout: 'dropdown',
              },
            },
            {
              name: 'title', title: 'Title', type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'ar', title: 'Arabic', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
              ],
            },
            {
              name: 'desc', title: 'Description', type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'ar', title: 'Arabic', type: 'text' },
                { name: 'de', title: 'German', type: 'text' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});