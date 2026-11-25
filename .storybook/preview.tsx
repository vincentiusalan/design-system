import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';
import { ThemedDocsContainer } from './ThemedDocsContainer';

/**
 * Applies the toolbar (or story-level) theme to a wrapper element.
 * Tokens are CSS custom properties scoped by `[data-theme]`, so they cascade into
 * the story. Scoping to the wrapper rather than <html> keeps a single `Dark`
 * story from turning a whole Docs page dark.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  const isDocs = context.viewMode === 'docs';
  return (
    <div
      data-theme={theme}
      style={{
        background: 'var(--bg)',
        color: 'var(--fg)',
        padding: 24,
        minHeight: isDocs ? undefined : '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    // Keep fullscreen: the theme wrapper supplies the 24px padding. Storybook's
    // 'padded' layout would leave a light 16px body edge around dark stories.
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },
    // Docs pages follow the toolbar theme too (see ThemedDocsContainer.tsx).
    docs: { container: ThemedDocsContainer },
    // Fail the test run on any axe violation instead of only warning.
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Patterns'] },
    },
  },
  tags: ['autodocs'],
};

export default preview;
