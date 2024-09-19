import { createClient, type QueryParams } from '@sanity/client'
import { isPreviewDeployment } from './is-preview-deployment';
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
const SANITY_API_TOKEN = env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN

if (isPreviewDeployment && !SANITY_API_TOKEN) {
  throw new Error("The `SANITY_API_TOKEN` environment variable is required.");
}

export const client = createClient({
  projectId: 'yvmgzxdp',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  perspective: isPreviewDeployment ? 'previewDrafts' : 'published',
  ...(isPreviewDeployment && { token: SANITY_API_TOKEN }),
})

export default async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params);
}
