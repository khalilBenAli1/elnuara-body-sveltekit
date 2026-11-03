import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      paths: { base: '/elnuara-body-sveltekit', relative: false }
    })
  ],
  test: { include: ['src/**/*.test.ts'] }
});
