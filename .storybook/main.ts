import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-flavoured Markdown, so tables in MDX pages render.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  // A portfolio piece: hide the onboarding checklist and release-notes toasts.
  features: { sidebarOnboardingChecklist: false },
  core: { disableWhatsNewNotifications: true },
};

export default config;
