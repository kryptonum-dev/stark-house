import { defineField } from 'sanity';

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
