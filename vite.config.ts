import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/ws': {
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
  },
});
