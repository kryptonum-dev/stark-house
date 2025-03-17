import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'ImagesMarquee';
const title = 'Przewijane obrazy';
const icon = () => '🖼️'

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'firstRowImages',
      type: 'array',
      title: 'Obrazy pierwszego rzędu',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Obraz',
        }),
      ],
      validation: Rule => Rule.required().min(3),
    }),
    defineField({
      name: 'secondRowImages',
      type: 'array',
      title: 'Obrazy drugiego rzędu',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Obraz',
        }),
      ],
      validation: Rule => Rule.required().min(3),
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
