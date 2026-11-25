import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Triggers an action. Lime is reserved for the single most important action on a screen.

**Use when** the user does something: submit, open, confirm, delete.
**Use a link instead** when it only navigates to another page.

| Variant | Use for |
| --- | --- |
| \`primary\` | The one main action per view |
| \`secondary\` | Alternatives next to a primary action |
| \`ghost\` | Low-emphasis actions such as Cancel |
| \`danger\` | Destructive actions; pair with a confirmation Dialog |

**Do** write the label as a verb plus object ("Send message"). Keep \`loading\` on while a request runs, so it can't be sent twice.
**Don't** put two primary buttons side by side, or use a button only to change pages.`,
      },
    },
  },
  args: {
    children: 'View case study',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio' },
    size: { control: 'inline-radio' },
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lime surface. Reserved for the one action that matters most on a screen. */
export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Ghost: Story = { args: { variant: 'ghost', children: 'Cancel' } };

export const Danger: Story = { args: { variant: 'danger', children: 'Delete draft' } };

export const WithIcon: Story = { args: { icon: <ArrowIcon /> } };

export const Loading: Story = { args: { loading: true, children: 'Sending' } };

export const Disabled: Story = { args: { disabled: true } };

/** All sizes side by side, to check the 32 / 40 / 48 px height scale. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

/** Every variant in dark mode. The a11y test checks contrast against the dark tokens. */
export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args}>Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} disabled>Disabled</Button>
    </div>
  ),
};

/** Keyboard test: Tab reaches the button and Enter activates it. */
export const KeyboardFocus: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: /view case study/i });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Interaction test: a click fires `onClick` exactly once. */
export const ClickFiresHandler: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /view case study/i }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Interaction test: a loading button is busy and swallows clicks. */
export const LoadingBlocksClicks: Story = {
  args: { loading: true, children: 'Sending' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: /sending/i });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
