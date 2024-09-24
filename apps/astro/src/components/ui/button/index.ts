export { default, type Props as ButtonDataProps } from './index.astro';

export const ButtonDataQuery = (name: string) => `
  ${name} {
    text,
    theme,
    "linkType": type,
    "href": select(type == "internal" => internal -> slug.current, type == "internalId" => internalId, type == "external" => external),
  },
`
