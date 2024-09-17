import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'Landing_Collection';
const title = 'Landing Pages';
const icon = () => '📄';

export default defineType({
  name,
  type: 'document',
  title,
  icon,
  fields: [
    ...defineSlugForDocument({}),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
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
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare: ({ title, slug }) => ({
      title: title,
      subtitle: slug,
    })
  }
});
