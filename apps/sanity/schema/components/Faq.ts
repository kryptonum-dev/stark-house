import { defineField } from 'sanity'
import { toPlainText } from '../../utils/to-plain-text'
import sectionId from '../ui/sectionId';

const name = 'Faq'
const title = 'Sekcja FAQ'
const icon = () => '❓';

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
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Elementy',
      of: [
        defineField({
          name: 'item',
          title: 'Referencja do elementu ze zbioru FAQ',
          type: 'reference',
          to: [{ type: 'Faq_Collection' }],
          options: {
            filter: ({ parent }) => {
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              if (selectedIds.length > 0) {
                return {
                  filter: '!(_id in $selectedIds)',
                  params: { selectedIds }
                }
              }
              return {}
            }
          }
        })
      ],
      validation: Rule => Rule.required().unique(),
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
})
