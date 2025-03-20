/// <reference path="../.astro/types.d.ts" />

interface FormStatusTypes {
  sending: boolean;
  success: boolean | undefined;
}

interface ImportMetaEnv {
  readonly SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
