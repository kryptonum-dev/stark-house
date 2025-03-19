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
import Partners from "./components/Partners";
import ImagesMarquee from "./components/ImagesMarquee";
import PackagesTables from "./components/PackagesTables";
import Partnership from "./components/Partnership";
import Comparison from "./components/Comparison";
import ListWithIcons from "./components/ListWithIcons";
import OfferShowcase from "./components/OfferShowcase";

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
    Partners,
    ImagesMarquee,
    PackagesTables,
    Partnership,
    Comparison,
    ListWithIcons,
    OfferShowcase,
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
