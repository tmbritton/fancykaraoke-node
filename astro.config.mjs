import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import PubSub from './src/helpers/pubSub';
import subscriptions from './src/helpers/globalSubscriptions';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: true,
  adapter: node({
    mode: 'standalone'
  }),
});
