import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'ContactForm';
const title = 'Sekcja z formularzem kontaktowym';
const icon = () => '📧';

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
      name: 'review',
      type: 'object',
      title: 'Opinia',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Zdjęcie (opcjonalne)',
        }),
        defineField({
          name: 'name',
          type: 'string',
          title: 'Imię i nazwisko',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'position',
          type: 'string',
          title: 'Stanowisko',
        }),
        defineField({
          name: 'review',
          type: 'text',
          rows: 3,
          title: 'Opinia',
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title,
      subtitle: toPlainText(heading),
      icon,
    }),
  },
});
