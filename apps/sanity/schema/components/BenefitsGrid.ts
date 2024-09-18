import { defineField } from 'sanity'
import { toPlainText } from '../../utils/to-plain-text'

const name = 'BenefitsGrid'
const title = 'Siatka korzyści'
const icon = () => '📊'

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
      type: 'PortableText',
      title: 'Podtytuł',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      title: 'Korzyści',
      of: [
        defineField({
          name: 'benefit',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'Heading',
              title: 'Tytuł',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'PortableText',
              title: 'Opis',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
            },
            prepare: ({ title, description }) => ({
              title: toPlainText(title),
              subtitle: toPlainText(description),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
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
})
