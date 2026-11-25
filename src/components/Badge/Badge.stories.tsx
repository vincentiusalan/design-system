import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `
A small, non-interactive label for metadata: role, year, read time, status.

**Use when** you need to tag content with a short fact.
**Use a Button instead** if it should do something when tapped.

**Do** keep it to one to three words; use \`mono\` for numbers so digits line up.
**Don't** use more than one \`accent\` badge per card, or make a badge clickable.`,
      },
    },
  },
  args: { children: 'Product design' },
  argTypes: { tone: { control: 'inline-radio' } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Accent: Story = { args: { tone: 'accent', children: 'Featured' } };

/** Status with an ambient pulse. The pulse stops under `prefers-reduced-motion`. */
export const Live: Story = { args: { tone: 'live', children: 'Open to work' } };

/** Durations and numbers use Geist Mono so digits line up. */
export const ReadTime: Story = { args: { mono: true, children: '6 min read' } };

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Badge>UX research</Badge>
      <Badge mono>6 min read</Badge>
      <Badge tone="accent">Featured</Badge>
      <Badge tone="live">Open to work</Badge>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Badge>UX research</Badge>
      <Badge>2025</Badge>
      <Badge mono>6 min read</Badge>
      <Badge tone="accent">Featured</Badge>
      <Badge tone="live">Open to work</Badge>
    </div>
  ),
};
