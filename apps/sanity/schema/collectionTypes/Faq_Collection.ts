import { defineField, defineType } from "sanity";
import { toPlainText } from "../../utils/to-plain-text";

const name = 'Faq_Collection';
const title = 'Zbiór elementów FAQ';
const icon = () => '❓';

export default defineType({
  name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'question',
      type: 'Heading',
      title: 'Pytanie',
    }),
    defineField({
      name: 'answer',
      type: 'PortableText',
      title: 'Odpowiedź',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
    prepare: ({ title, subtitle }) => ({
      title: toPlainText(title),
      subtitle: toPlainText(subtitle),
    })
  }
});
