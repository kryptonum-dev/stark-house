import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'ExpoLeadForm';
const title = 'Sekcja: Expo – formularz leadowy';
const icon = () => '🎫';

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
      title: 'Paragraf (pod nagłówkiem)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'groupId',
      type: 'string',
      title: 'MailerLite Group ID',
      description: 'ID grupy MailerLite do subskrypcji (opcjonalnie może być puste).',
    }),
    defineField({
      name: 'linkedin_conversion',
      type: 'object',
      title: 'LinkedIn Conversion',
      description:
        'LinkedIn Conversion do trackowania (wymaga skonfigurowanego pixela i direct API).',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'pixel_conversion_id',
          type: 'number',
          title: 'Pixel Conversion ID',
        }),
        defineField({
          name: 'direct_api_conversion_id',
          type: 'number',
          title: 'Direct API Conversion ID',
        }),
      ],
    }),
    ...sectionId,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title,
      subtitle: toPlainText(heading),
      icon,
    }),
  },
});


