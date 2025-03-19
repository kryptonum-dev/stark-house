import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'OfferShowcase';
const title = 'Showcase oferty';
const icon = () => '🏠';

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
      name: 'catalog_url',
      type: 'url',
      title: 'URL katalogu PDF',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'offers',
      type: 'array',
      title: 'Oferty',
      of: [
        defineField({
          name: 'offer',
          type: 'object',
          fields: [
            defineField({
              name: 'img',
              type: 'image',
              title: 'Obraz',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Tytuł',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraf',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'features',
              type: 'array',
              title: 'Cechy',
              of: [
                defineField({
                  name: 'feature',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'icon',
                      type: 'image',
                      title: 'Ikona',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'tag',
                      type: 'string',
                      title: 'Tag',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'name',
                      type: 'string',
                      title: 'Nazwa',
                      validation: Rule => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'tag',
                      subtitle: 'name',
                      media: 'icon',
                    },
                    prepare: ({ title, subtitle, media }) => ({
                      title,
                      subtitle,
                      media,
                    }),
                  },
                }),
              ],
              validation: Rule => Rule.required(),
            }),
          ],
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
