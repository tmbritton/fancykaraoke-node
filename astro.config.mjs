import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import customElements from 'custom-elements-ssr/astro.js';
import htmx from 'astro-htmx';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: true,
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [customElements(), tailwind(), htmx()]
});