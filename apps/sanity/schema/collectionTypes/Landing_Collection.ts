import { defineType } from "sanity";
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
