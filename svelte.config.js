import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],
  kit: {
    adapter: adapter({
      envPrefix: "BUN_SERVER_",
    }),
    alias: {
      $components: "./src/lib/components",
      $utils: "./src/lib/utils",
      $server: "./src/lib/server",
      $types: "./src/lib/types",
      $drizzle: "./drizzle",
      $socket: "./socket",
      $shared: "./src/shared",
    },
  },
};

export default config;
