import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'Comparison';
const title = 'Sekcja porównania';
const icon = () => '📊';

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
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Elementy porównania',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Element porównania',
          fields: [
            defineField({
              name: 'timelineName',
              type: 'string',
              title: 'Nazwa osi czasu',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'callout',
              type: 'text',
              rows: 3,
              title: 'Wyróżnik (opcjonalnie)',
            }),
            defineField({
              name: 'timeline',
              type: 'array',
              title: 'Oś czasu',
              of: [
                defineField({
                  name: 'timelineEvent',
                  type: 'object',
                  title: 'Wydarzenie na osi',
                  fields: [
                    defineField({
                      name: 'day',
                      type: 'string',
                      title: 'Dzień',
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
                      day: 'day',
                      name: 'name',
                    },
                    prepare: ({ day, name }) => ({
                      title: `${day}: ${name}`,
                    }),
                  },
                }),
              ],
              validation: Rule => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              timelineName: 'timelineName',
              callout: 'callout',
            },
            prepare: ({ timelineName, callout }) => ({
              title: timelineName,
              subtitle: callout ? `Wyróżnik: ${callout}` : 'Bez wyróżnika',
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
