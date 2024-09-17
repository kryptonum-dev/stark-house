import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'LandingFeature';
const title = 'Sekcja z cechami carportu';
const icon = () => '🅿️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Logo (optional)',
      description: 'The logo should be in SVG format.',
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      title: 'Buttons',
      of: [{ type: 'cta' }],
      validation: Rule => Rule.required().max(2),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sectionId',
      type: 'string',
      title: 'Section ID (optional)',
      description: 'The Section ID is a unique identifier used to link to specific sections of the page.',
      group: 'sectionId',
    }),
  ],
  groups: [
    { name: 'sectionId', title: 'Section ID' },
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'image',
    },
    prepare: ({ heading, media }) => ({
      title: title,
      subtitle: toPlainText(heading),
      media,
      icon,
    }),
  },
});
