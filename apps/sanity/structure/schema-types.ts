// Single Types
import global from '../schema/singleTypes/global';
import redirects from '../schema/singleTypes/redirects';
import NotFound_Page from '../schema/singleTypes/NotFound_Page';

const singleTypes = [
  global,
  redirects,
  NotFound_Page,
];

// Collections Types
import Landing_Collection from '../schema/collectionTypes/Landing_Collection';

const collectionTypes = [
  Landing_Collection,
];

// Components
import Components from '../schema/Components';

const components = [
  Components,
];

// UI Components
import cta from '../schema/ui/cta';
import seo from '../schema/ui/seo';
import PortableText from '../schema/ui/PortableText';
import Heading from '../schema/ui/PortableText/Heading';

const ui = [
  cta,
  seo,
  PortableText,
  Heading,
];

export const schemaTypes = [...singleTypes, ...collectionTypes, ...components, ...ui];

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(singleTypes.map(type => type.name as string));
