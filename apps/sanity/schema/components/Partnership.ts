import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'Partnership';
const title = 'Sekcja partnerstwa';
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
      name: 'subheading',
      type: 'Heading',
      title: 'Podtytuł (opcjonalnie)',
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'logos',
      type: 'array',
      title: 'Loga partnerów',
      of: [
        defineField({
          name: 'logo',
          type: 'object',
          title: 'Logo partnera',
          fields: [
            defineField({
              name: 'img',
              type: 'image',
              title: 'Logo',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Nazwa partnera',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'Link do strony (opcjonalny)',
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
