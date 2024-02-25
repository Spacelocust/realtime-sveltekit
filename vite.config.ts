import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:9998',
        ws: true,
      },
    },
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.svelte-kit/**',
        '**/data/**',
        '**/build/**',
        '**/docker/**',
        '**/script/**',
        '**/tests/**',
      ],
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), './drizzle/**/*.(ts|js)'],
    },
  },
});
