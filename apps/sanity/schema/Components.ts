import { defineType } from "sanity";
import LandingFeature from "./components/LandingFeature";
import FullWidthPhoto from "./components/FullWidthPhoto";
import BenefitsGrid from "./components/BenefitsGrid";
import ImagedBenefitsSection from "./components/ImagedBenefitsSection";
import MetricsHighlightSection from "./components/MetricsHighlightSection";

export default defineType({
  name: 'components',
  type: 'array',
  title: 'Components',
  of: [
    LandingFeature,
    FullWidthPhoto,
    BenefitsGrid,
    ImagedBenefitsSection,
    MetricsHighlightSection,
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
