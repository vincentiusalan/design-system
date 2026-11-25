/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        // Turns every story into a test: render + play function + a11y checks.
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        // Visual regression: screenshots of key stories compared to saved baselines.
        // Baselines are platform-specific (font rendering), so this runs locally,
        // not in CI. Update after an intended change: `pnpm test:visual -u`.
        test: {
          name: 'visual',
          include: ['src/**/*.visual.test.tsx'],
          setupFiles: ['src/visual/setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
            viewport: { width: 800, height: 480 },
          },
        },
      },
    ],
  },
});
