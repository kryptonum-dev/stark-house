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
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Opinie',
      of: [
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
              title: 'Imię i nazwisko (zalecane)',
            }),
            defineField({
              name: 'position',
              type: 'string',
              title: 'Stanowisko',
            }),
            defineField({
              name: 'content',
              type: 'PortableText',
              title: 'Treść opinii',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              media: 'img',
              name: 'name',
              position: 'position',
              content: 'content',
            },
            prepare: ({ media, name, position, content }) => ({
              title: name || toPlainText(content),
              subtitle: position,
              media,
            }),
          },
          validation: Rule => Rule.required(),
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
