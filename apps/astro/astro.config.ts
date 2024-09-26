import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import partytown from '@astrojs/partytown';
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { DOMAIN } from "./src/global/constants";
import { isPreviewDeployment } from "./src/utils/is-preview-deployment";
import redirects from "./redirects";

export default defineConfig({
  site: DOMAIN,
  integrations: [
    preact({ compat: true }),
    partytown({
      config: {
        debug: true,
        forward: ['dataLayer.push', 'fbq'],
        resolveUrl: function (url, _, type) {
          if (type === 'script' && !url.href.includes('/proxy')) {
            console.log('Proxying URL:', url.href);
            const proxyUrl = new URL(`/proxy/${url.href}}`, 'https://stark-house-git-dev-kryptonum.vercel.app');
            return proxyUrl;
          }
          return url;
        },
      }
    }),
    sitemap(),
  ],
  image: {
    remotePatterns: [{
      protocol: "https",
      hostname: "cdn.sanity.io"
    }],
  },
  prefetch: {
    prefetchAll: true
  },
  redirects: redirects,
  output: isPreviewDeployment ? "server" : "hybrid",
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['react-hook-form', '@astrojs/partytown']
    }
  }
});
