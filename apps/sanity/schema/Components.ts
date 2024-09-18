import { defineType } from "sanity";
import LandingFeature from "./components/LandingFeature";
import FullWidthPhoto from "./components/FullWidthPhoto";

export default defineType({
  name: 'components',
  type: 'array',
  title: 'Components',
  of: [
    LandingFeature,
    FullWidthPhoto,
  ],
  options: {
    insertMenu: {
      filter: true,
      showIcons: true,
      views: [
        { name: 'grid', previewImageUrl: (schemaTypeName) => `/static/${schemaTypeName}.webp` },
        { name: 'list' },
      ]
    }
  }
});
