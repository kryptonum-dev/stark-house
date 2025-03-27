import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'Partners';
const title = 'Sekcja z partnerami';
const icon = () => '🤝';

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
      name: 'review',
      type: 'object',
      title: 'Opinia',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Zdjęcie',
          validation: Rule => Rule.required(),
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
        },
        prepare: ({ media, name, position }) => ({
          title: name,
          subtitle: position,
          media,
        }),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'partners',
      type: 'array',
      title: 'Partnerzy',
      of: [
        defineField({
          name: 'partner',
          type: 'object',
          title: 'Partner',
          fields: [
            defineField({
              name: 'img',
              type: 'image',
              title: 'Logo partnera',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Nazwa partnera',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'url',
              title: 'Link do strony partnera (opcjonalny)',
            }),
          ],
          preview: {
            select: {
              media: 'img',
              name: 'name',
            },
            prepare: ({ media, name }) => ({
              title: name,
              media,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
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
