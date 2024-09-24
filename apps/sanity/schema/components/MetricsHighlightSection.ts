import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'MetricsHighlightSection';
const title = 'Sekcja z wyróżnionymi metrykami';
const icon = () => '📈'

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
      name: 'metrics',
      type: 'array',
      title: 'Metryki',
      of: [
        defineField({
          name: 'metric',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              title: 'Wartość',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 3,
              title: 'Opis',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value',
              description: 'description',
            },
            prepare: ({ value, description }) => ({
              title: value,
              subtitle: description,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required()
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
