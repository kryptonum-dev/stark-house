import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { PortableText } from "../ui/PortableText";

const name = 'PrivacyPolicy_Page';
const title = 'Polityka Prywatności';
const icon = () => '📄';
const slug = '/polityka-prywatnosci';

export default defineType({
  name,
  type: 'document',
  title,
  icon,
  fields: [
    ...defineSlugForDocument({ slug: slug }),
    defineField({
      name: 'header',
      type: 'object',
      title: 'Nagłówek',
      fields: [
        defineField({
          name: 'heading',
          type: 'Heading',
          title: 'Nagłówek',
        }),
        defineField({
          name: 'paragraph',
          type: 'PortableText',
          title: 'Paragraf',
        }),
      ],
    }),
    PortableText({
      name: 'content',
      title: 'Treść',
      allowHeadings: true
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    prepare: () => ({
      title: title,
      subtitle: slug,
    })
  }
});
