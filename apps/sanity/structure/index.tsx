import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from './create-singleton';
import { createCollection } from './create-collection';

export const TYPES_TO_EXCLUDE_PREVIEWS = ['global', 'redirects', 'Faq_Collection'];

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Zawartość')
    .items([
      createSingleton(S, "global"),
      createSingleton(S, "redirects"),
      S.divider(),
      createCollection(S, "Landing_Collection"),
      S.divider(),
      createSingleton(S, "NotFound_Page"),
      createSingleton(S, "PrivacyPolicy_Page"),
      S.divider(),
      createCollection(S, "Faq_Collection"),
    ])
