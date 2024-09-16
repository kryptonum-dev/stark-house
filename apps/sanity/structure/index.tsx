import type { StructureResolver } from 'sanity/structure'
import { createSingleton } from './create-singleton';
import { createCollection } from './create-collection';

export const TYPES_TO_EXCLUDE_PREVIEWS = ['global', 'redirects', 'Landing_Collection'];

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Zawartość')
    .items([
      createSingleton(S, "global"),
      createSingleton(S, "redirects"),
      S.divider(),
      createCollection(S, "Landing_Collection"),
    ])
