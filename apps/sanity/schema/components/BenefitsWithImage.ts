import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'BenefitsWithImage';
const title = 'Sekcja z korzyściami i obrazem';
const icon = () => '🏆';

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
      name: 'img',
      type: 'image',
      title: 'Obraz',
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
      validation: Rule => Rule.required()
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'image',
    },
    prepare: ({ heading, media }) => ({
      title,
      subtitle: toPlainText(heading),
      media,
      icon,
    }),
  },
});
