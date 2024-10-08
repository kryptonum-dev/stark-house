import { defineType } from "sanity";
import LandingFeature from "./components/LandingFeature";
import FullWidthPhoto from "./components/FullWidthPhoto";
import BenefitsGrid from "./components/BenefitsGrid";
import ImagedBenefitsSection from "./components/ImagedBenefitsSection";
import MetricsHighlightSection from "./components/MetricsHighlightSection";
import BenefitsWithImage from "./components/BenefitsWithImage";
import BenefitsNumberedGrid from "./components/BenefitsNumberedGrid";
import GridShowcaseSection from "./components/GridShowcaseSection";
import Faq from "./components/Faq";
import ProcessAccordion from "./components/ProcessAccordion";
import TestimonialSection from "./components/TestimonialSection";
import Newsletter from "./components/Newsletter";
import ContactForm from "./components/ContactForm";

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
    BenefitsWithImage,
    BenefitsNumberedGrid,
    GridShowcaseSection,
    Faq,
    ProcessAccordion,
    TestimonialSection,
    Newsletter,
    ContactForm,
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
