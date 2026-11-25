import { composeStories } from '@storybook/react-vite';
import { act, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as Badge from '../components/Badge/Badge.stories';
import * as Button from '../components/Button/Button.stories';
import * as CaseCard from '../components/CaseCard/CaseCard.stories';
import * as Checkbox from '../components/Checkbox/Checkbox.stories';
import * as Switch from '../components/Switch/Switch.stories';
import * as Tabs from '../components/Tabs/Tabs.stories';
import * as TextField from '../components/TextField/TextField.stories';

/**
 * One light and one dark "overview" story per component. Dialog is left out:
 * it only appears after a click, which the interaction tests already cover.
 */
const cases: [string, ComponentType][] = [
  ['badge-gallery', composeStories(Badge).Gallery],
  ['badge-dark', composeStories(Badge).Dark],
  ['button-sizes', composeStories(Button).Sizes],
  ['button-dark', composeStories(Button).Dark],
  ['textfield-error', composeStories(TextField).Error],
  ['textfield-dark', composeStories(TextField).Dark],
  ['switch-on', composeStories(Switch).On],
  ['switch-dark', composeStories(Switch).Dark],
  ['checkbox-select-all', composeStories(Checkbox).SelectAll],
  ['checkbox-dark', composeStories(Checkbox).Dark],
  ['tabs-default', composeStories(Tabs).Default],
  ['tabs-dark', composeStories(Tabs).Dark],
  ['casecard-featured', composeStories(CaseCard).Featured],
  ['casecard-dark', composeStories(CaseCard).Dark],
];

let root: Root | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
});

test.each(cases)('%s looks the same as its baseline', async (name, Story) => {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root!.render(<Story />));
  await document.fonts.ready;

  await expect.element(page.elementLocator(host)).toMatchScreenshot(name);
});
