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
      name: 'reviews',
      type: 'array',
      title: 'Opinie',
      of: [
        {
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
              type: 'PortableText',
              title: 'Opinia',
              validation: Rule => Rule.required(),
            }),
          ],
        }
      ],
    }),
    defineField({
      name: 'linkedin_conversion',
      type: 'object',
      title: 'LinkedIn Conversion',
      description: 'LinkedIn Conversion for tracking form submissions (note: LinkedIn must be configured as a separate pixel and direct API)',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'pixel_conversion_id',
          type: 'number',
          title: 'Pixel Conversion ID',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'direct_api_conversion_id',
          type: 'number',
          title: 'Direct API Conversion ID',
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
