import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import vercel from "@astrojs/vercel";
import { DOMAIN } from "./src/global/constants";
import { isProductionDeployment } from "./src/utils/is-production-deployment";
import redirects from "./redirects";

export default defineConfig({
  site: DOMAIN,
  integrations: [
    preact({ compat: true }),
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
  vite: {
    ssr: {
      noExternal: ['react-hook-form']
    }
  },
  output: 'server',
  adapter: vercel({
    ...(isProductionDeployment && {
      isr: {
        bypassToken: process.env.VERCEL_DEPLOYMENT_ID,
        exclude: [/^\/api\/.+/]
      }
    })
  }),
});
