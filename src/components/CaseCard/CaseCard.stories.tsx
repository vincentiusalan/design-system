import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CaseCard } from './CaseCard';

const meta = {
  title: 'Patterns/CaseCard',
  component: CaseCard,
  parameters: {
    docs: {
      description: {
        component: `
A pattern, not a primitive: a case-study teaser composed from **Badge** and **Button**.

**Use when** listing work on a home or index page.

**Do** pair every result with its baseline (\`43 s → 16 min\`, not a bare \`+2,133%\`); mark at most one card as \`featured\`.
**Don't** put more than four tags on a card, or a metric you can't source.`,
      },
    },
  },
  args: {
    title: 'When to ask for the microphone',
    summary:
      'Moving one permission prompt from first launch to the moment of need changed how long people stayed.',
    tags: ['Product design', '2025'],
    metric: { before: '43 s', after: '16 min', label: 'Median session length' },
    readMinutes: 6,
    onOpen: fn(),
  },
} satisfies Meta<typeof CaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Featured cards switch the CTA to the lime primary button. */
export const Featured: Story = { args: { featured: true } };

export const WithoutMetric: Story = { args: { metric: undefined } };

/** Stress test: long copy must wrap, not overflow. */
export const LongContent: Story = {
  args: {
    title: 'One question per screen: rebuilding a twelve-step onboarding quiz for first-time learners',
    tags: ['UX research', 'Interaction design', 'Usability testing', '2025'],
    metric: { before: '45%', after: '81%', label: 'Quiz completion rate' },
  },
};

/** A grid of cards, like the "Selected work" section. */
export const Grid: Story = {
  render: (args) => (
    // min(300px, 100%) lets a column shrink below 300px on narrow phones instead of overflowing.
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
      <CaseCard {...args} featured />
      <CaseCard
        {...args}
        title="One question per screen"
        summary="Splitting a dense quiz into single steps lifted completion."
        metric={{ before: '45%', after: '81%', label: 'Quiz completion rate' }}
        readMinutes={5}
      />
    </div>
  ),
};

/**
 * The grid on a small phone. The toolbar viewport is set to "Small mobile", and the
 * test renders into a fixed 272px column (320px minus page padding), so it checks
 * the same width wherever it runs: cards stack and nothing overflows.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: (args, context) => (
    <div data-testid="phone-column" style={{ width: 272 }}>
      {Grid.render?.(args, context)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const column = within(canvasElement).getByTestId('phone-column');
    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
    for (const card of column.querySelectorAll('article')) {
      await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    }
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: Grid.render,
};

/** Interaction test: the CTA calls `onOpen`. */
export const OpensCaseStudy: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /read case study/i }));
    await expect(args.onOpen).toHaveBeenCalledOnce();
  },
};
