/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import tsconfigPaths from 'vite-tsconfig-paths';

// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    tsconfigPaths(),
    solidSvg({ defaultAsComponent: true }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
    isolate: false,
    coverage: {
      provider: 'v8',
      include: ['src'],
      exclude: ['src/stories', 'src/index.tsx', 'src/App.tsx'],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
