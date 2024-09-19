import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'ImagedBenefitsSection';
const title = 'Sekcja korzyści z obrazkami';
const icon = () => '✅';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'isReversed',
      type: 'boolean',
      title: 'Czy sekcja powinna być odwrócona?',
      description: 'Domyślnie sekcja nie jest odwrócona, i zdjęcia znajdują się po prawej stronie. Jeśli zaznaczysz tą opcję, zdjęcia będą po lewej stronie.',
      initialValue: false,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania',
      validation: Rule => Rule.required(),
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
              title: 'Opis',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'img',
              type: 'image',
              title: 'Zdjęcie',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
              media: 'img',
            },
            prepare: ({ title, description, media }) => ({
              title: toPlainText(title),
              subtitle: toPlainText(description),
              media,
            }),
          }
        }),
      ],
      validation: Rule => Rule.required()
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      benefits: 'benefits',
    },
    prepare: ({ heading }) => ({
      title,
      subtitle: toPlainText(heading),
    }),
  },
});
