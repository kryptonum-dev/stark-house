import { defineField } from 'sanity'
import { toPlainText } from '../../utils/to-plain-text'
import sectionId from '../ui/sectionId'

const name = 'packagesTables'
const title = 'Sekcja porównania pakietów'
const icon = () => '📊'

const PACKAGE_TYPES = [
  { title: 'Standard', value: 'standard' },
  { title: 'Enhanced', value: 'enhanced' },
  { title: 'Advanced', value: 'advanced' },
  { title: 'Ultimate', value: 'ultimate' },
  { title: 'Elite', value: 'elite' },
]

export default defineField({
  name,
  title,
  type: 'object',
  icon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      title: 'Paragraph',
      type: 'PortableText',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'packageTypes',
      title: 'Typy Pakietów',
      description: 'Wybierz aktywne pakiety',
      type: 'array',
      of: [
        defineField({
          name: 'packageType',
          type: 'object',
          title: 'Pakiet',
          fields: [
            defineField({
              name: 'type',
              title: 'Typ Pakietu',
              type: 'string',
              options: {
                list: PACKAGE_TYPES,
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'isHighlighted',
              title: 'Wyróżniony Pakiet',
              type: 'boolean',
              initialValue: false,
              description: 'Wyróżnia ten pakiet wizualnie jako rekomendowany',
            }),
          ],
          preview: {
            select: {
              type: 'type',
              isHighlighted: 'isHighlighted',
            },
            prepare: ({ type, isHighlighted }) => {
              const packageType = PACKAGE_TYPES.find(p => p.value === type)
              return {
                title: packageType?.title || type,
                subtitle: isHighlighted ? '✨ Wyróżniony' : '',
              }
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(1).custom((packageTypes: any[] | undefined) => {
        if (!packageTypes) return true;
        const types = packageTypes.map(pt => pt.type);
        const uniqueTypes = new Set(types);
        return types.length === uniqueTypes.size || 'Każdy typ pakietu może być wybrany tylko raz';
      }),
    }),
    defineField({
      name: 'features',
      title: 'Funkcje',
      type: 'array',
      of: [
        defineField({
          name: 'feature',
          type: 'object',
          title: 'Funkcja',
          fields: [
            defineField({
              name: 'name',
              title: 'Nazwa',
              type: 'text',
              rows: 5,
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'packageAvailability',
              title: 'Dostępność w Pakietach',
              description: 'Wybierz, w których pakietach ta funkcja jest dostępna',
              type: 'array',
              of: [
                defineField({
                  name: 'packageType',
                  type: 'string',
                  title: 'Pakiet',
                  options: {
                    list: PACKAGE_TYPES,
                    layout: 'radio',
                    direction: 'horizontal',
                  },
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.unique(),
            }),
          ],
          preview: {
            select: {
              name: 'name',
              packageAvailability: 'packageAvailability',
            },
            prepare: ({ name, packageAvailability = [] }) => {
              const packageNames = packageAvailability
                .map((pkg: string) => PACKAGE_TYPES.find(p => p.value === pkg)?.title)
                .filter(Boolean)
              return {
                title: name,
                subtitle: `Dostępne w: ${packageNames.join(', ')}`,
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Wezwanie do działania',
      type: 'cta',
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      title: 'heading',
      packageTypes: 'packageTypes',
    },
    prepare: ({ title: headingTitle, packageTypes = [] }) => ({
      title,
      subtitle: toPlainText(headingTitle) || `${packageTypes.length} pakietów`,
      icon,
    }),
  },
})
