import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'TestimonialSection';
const title = 'Sekcja z opiniami';
const icon = () => '💬';

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
      name: 'items',
      type: 'array',
      title: 'Opinie',
      of: [
        defineField({
          name: 'testimonial',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              type: 'PortableText',
              title: 'Tekst',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'author',
              type: 'string',
              title: 'Autor',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              text: 'text',
              author: 'author',
            },
            prepare: ({ text, author }) => ({
              title: toPlainText(text),
              subtitle: author,
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
