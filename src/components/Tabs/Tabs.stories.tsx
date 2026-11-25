import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tabs, type TabItem } from './Tabs';

const caseStudy: TabItem[] = [
  { id: 'problem', label: 'Problem', content: 'Most people left within the first minute, right after the microphone prompt.' },
  { id: 'discovery', label: 'Discovery', content: 'Session recordings showed the prompt appeared before anyone knew why it was needed.' },
  { id: 'outcome', label: 'Outcome', content: 'Asking at the moment of need moved the median session from 43 s to 16 min.' },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `
Switches between related views of the same content without leaving the page.

**Use when** the sections are parallel and people only need one at a time (Problem / Discovery / Outcome).
**Don't use** for steps that must be done in order (use a stepper), or to navigate to another page (use links).

**Do** keep labels to one or two words and the order stable; keep 2–6 tabs.
**Don't** hide content people need to compare side by side, or nest tabs inside tabs.

Keyboard: **Tab** enters the list once, **← →** move between tabs, **Home / End** jump to the first / last.`,
      },
    },
  },
  args: { items: caseStudy, label: 'Case study sections', onChange: fn() },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartOnOutcome: Story = { args: { defaultValue: 'outcome' } };

export const WithDisabledTab: Story = {
  args: {
    items: [...caseStudy, { id: 'reflection', label: 'Reflection', content: 'Coming soon.', disabled: true }],
  },
};

/** Many tabs on a narrow screen: the list scrolls sideways instead of wrapping. */
export const ManyTabs: Story = {
  args: {
    items: ['Hook', 'Context', 'Problem', 'Discovery', 'Turning point', 'Outcome', 'Reflection'].map(
      (label) => ({ id: label.toLowerCase().replace(' ', '-'), label, content: `${label} section.` }),
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Tabs {...args} />
    </div>
  ),
};

export const Dark: Story = { globals: { theme: 'dark' } };

/** Keyboard test: arrows move selection and the matching panel shows; it wraps around. */
export const ArrowKeys: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('tab', { name: 'Problem' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    const discovery = canvas.getByRole('tab', { name: 'Discovery' });
    await expect(discovery).toHaveFocus();
    await expect(discovery).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(/session recordings/i);
    await expect(args.onChange).toHaveBeenLastCalledWith('discovery');

    await userEvent.keyboard('{End}{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Problem' })).toHaveAttribute('aria-selected', 'true');
  },
};

/** Interaction test: clicking a tab shows its panel. */
export const ClickSelects: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Outcome' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(/16 min/);
  },
};
