import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';

const name = 'FullWidthPhoto';
const title = 'Sekcja ze zdjęciem na całą szerokość';
const icon = () => '🖼️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      media: 'img',
    },
    prepare: ({ media }) => ({
      title: title,
      media,
    }),
  },
});
