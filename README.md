# Vincentius Alan · Design System

[![CI](https://github.com/vincentiusalan/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/vincentiusalan/design-system/actions/workflows/ci.yml)

**Live Storybook: [vincentiusalan.github.io/design-system](https://vincentiusalan.github.io/design-system/)**

A small, documented and tested design system built with **Storybook 10**, React 19 and TypeScript,
by Vincentius Alan (product designer).

The tokens come from the design foundation of my portfolio, [vincentiusalan.com](https://vincentiusalan.com):
monochrome surfaces, one electric-lime accent, Geist + Geist Mono, a 4px spacing base, and motion
that switches off under `prefers-reduced-motion`.

## What's inside

| Layer | Items |
| --- | --- |
| Foundations (MDX) | Colors (light + dark, with contrast reasoning), Typography, Spacing & Radius, Motion |
| Components | Button, Badge, TextField, Switch, Checkbox, Tabs, Dialog |
| Patterns | CaseCard (composed from Badge + Button) |

Every component has: all states as stories, a `Dark` story, usage guidance on its Docs page
(when to use, do's and don'ts), and interaction + keyboard tests.

## Storybook features used

- **Args & Controls**: every prop is editable live; `argTypes` pick the right control.
- **Autodocs**: a generated Docs page with a props table for every component.
- **Usage docs**: when to use each component, with do's and don'ts (`parameters.docs.description.component`).
- **Interaction tests**: `play` functions click, type and assert (`storybook/test`).
- **Keyboard tests**: Tab, Enter, Space, arrow keys and Esc, not just mouse clicks.
- **Accessibility tests**: `@storybook/addon-a11y` with `a11y.test: 'error'`, so an axe violation fails the run.
- **Vitest addon**: every story runs as a test in headless Chromium (`pnpm test`), also from the "Run tests" button in the sidebar.
- **Visual regression tests**: key stories are screenshotted and compared with saved baselines (`pnpm test:visual`), using Vitest's `toMatchScreenshot` with portable stories (`composeStories`).
- **Theme toolbar for stories and docs**: a decorator applies `data-theme` so tokens switch light/dark, and a custom `DocsContainer` makes Docs and MDX pages follow the same toggle.
- **Responsive check**: `CaseCard › Mobile` fails if the grid overflows a small phone.
- **`useArgs`**: a controlled Switch story that stays in sync with the Controls panel.
- **Branded Storybook UI**: custom manager theme, Geist in the UI, own favicon, onboarding prompts hidden.
- **MDX docs pages**: `ColorPalette`, `Typeset`, and GitHub-flavoured Markdown tables via `remark-gfm`.
- **CI + deploy**: GitHub Actions runs lint, typecheck, tests and build on every push, then publishes Storybook to GitHub Pages.

## Run it

```bash
pnpm install
pnpm exec playwright install chromium   # once, for the browser tests
pnpm storybook        # dev server on http://localhost:6006
pnpm test             # every story as a test: interactions, keyboard, a11y
pnpm test:visual      # screenshot comparison against baselines
pnpm lint             # oxlint
pnpm exec tsc -b      # typecheck, including .storybook/
pnpm build-storybook  # static site in storybook-static/
```

**Visual baselines** are stored in `src/visual/__screenshots__/` and are specific to the OS
(font rendering differs between macOS and Linux), so `pnpm test:visual` runs locally, not in CI.
After an intended visual change, review the diff and update baselines with
`pnpm test:visual -u`.

## Structure

```
.github/workflows/ci.yml       lint, typecheck, test, build, deploy to Pages
.storybook/
  main.ts                      stories glob, addons, static fonts, UI flags
  preview.tsx                  tokens CSS, theme toolbar + decorator, a11y, sort order
  ThemedDocsContainer.tsx      Docs/MDX pages follow the theme toolbar
  themes.ts                    Storybook themes built from the tokens
  manager.ts, manager-head.html  Storybook UI branding and fonts
src/
  tokens/tokens.css            design tokens (light + dark), the source of truth
  docs/*.mdx                   Introduction and Foundations pages
  components/<Name>/
    <Name>.tsx                 component
    <Name>.css                 styles using tokens only
    <Name>.stories.tsx         stories, usage docs, play tests
  visual/                      visual regression tests + baselines
```
