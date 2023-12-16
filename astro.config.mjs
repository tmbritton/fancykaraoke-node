import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: true,
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [lit()]
});
