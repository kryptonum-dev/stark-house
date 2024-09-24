import { defineField } from 'sanity';
import { toPlainText } from '../../utils/to-plain-text';
import sectionId from '../ui/sectionId';

const name = 'Newsletter';
const title = 'Sekcja newsletter';
const icon = () => '📧'

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
      name: 'groupId',
      type: 'string',
      title: 'Grupa ID w MailerLite',
      description: (
        <>
          ID Grupy w MailerLite do której ma zostać przypisana osoba. <a href="https://www.mailerlite.com/pl/help/where-to-find-the-mailerlite-api-key-groupid-and-documentation#new/group-id" target="_blank">Jak znaleźć ID grupy w MailerLite?</a>
        </>
      ),
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
