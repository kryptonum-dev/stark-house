import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'BenefitsNumberedGrid';
const title = 'Siatka ponumerowanych korzyści';
const icon = () => '🔢';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraf (opcjonalnie)',
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      title: 'Korzyści',
      of: [
        defineField({
          name: 'benefit',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'Heading',
              title: 'Tytuł',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'PortableText',
              title: 'Opis (opcjonalnie)',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
            },
            prepare: ({ title, description }) => ({
              title: toPlainText(title),
              subtitle: toPlainText(description),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      icon,
    }),
  },
});
