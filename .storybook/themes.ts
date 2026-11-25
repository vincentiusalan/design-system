import { create } from 'storybook/theming';

/**
 * Storybook themes built from the design tokens (src/tokens/tokens.css).
 * Storybook's theming API needs literal values, so the token is noted next to each.
 */
const shared = {
  fontBase: '"Geist", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"Geist Mono", ui-monospace, monospace',
  appBorderRadius: 10, // --radius-md
  inputBorderRadius: 10,
};

/** Docs pages, light theme. */
export const docsLight = create({
  ...shared,
  base: 'light',
  appBg: '#F6F6F4', // --surface
  appContentBg: '#FBFBFA', // --bg
  appPreviewBg: '#FBFBFA',
  appBorderColor: '#E4E4E0', // --border
  textColor: '#131313', // --fg
  textMutedColor: '#5C5C58', // --fg-muted
  colorPrimary: '#4D7C0F', // --accent (lime-700: readable on light)
  colorSecondary: '#4D7C0F',
  barBg: '#FFFFFF', // --panel
});

/** Docs pages, dark theme. */
export const docsDark = create({
  ...shared,
  base: 'dark',
  appBg: '#141416', // --surface
  appContentBg: '#0A0A0B', // --bg
  appPreviewBg: '#0A0A0B',
  appBorderColor: '#232326', // --border
  textColor: '#F2F2F0', // --fg
  textMutedColor: '#A3A3A0', // --fg-muted
  colorPrimary: '#BEF264', // --accent (lime-300: readable on dark)
  colorSecondary: '#BEF264',
  barBg: '#0E0E10', // --panel
});

/** The Storybook UI around the canvas (sidebar, toolbar). Always dark. */
export const manager = create({
  ...shared,
  base: 'dark',
  brandTitle: 'Vincentius Alan · Design System',
  colorSecondary: '#BEF264',
  appBg: '#0E0E10',
  appContentBg: '#0A0A0B',
  appBorderColor: '#232326',
  barBg: '#0E0E10',
  barSelectedColor: '#BEF264',
  textColor: '#F2F2F0',
  textInverseColor: '#131313',
});
