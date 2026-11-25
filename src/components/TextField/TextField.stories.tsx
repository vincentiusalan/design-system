import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: `
A single-line text input with a visible label, optional hint and error message.

**Use when** the answer is short and free-form: name, email, URL.
**Use something else** for a fixed set of options (Checkbox, Tabs, a select) or long text (a textarea).

**Do** always show a label (placeholders disappear while typing); write errors that say how to fix it ("Enter a complete email address").
**Don't** show an error before the user has finished typing, or blame the user ("Invalid input").`,
      },
    },
  },
  args: {
    label: 'Email',
    placeholder: 'you@company.com',
    type: 'email',
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'I reply within one working day.' },
};

export const Required: Story = { args: { required: true } };

export const Error: Story = {
  args: { defaultValue: 'alan@', error: 'Enter a complete email address, like name@company.com.' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'locked@example.com' } };

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 20 }}>
      <TextField {...args} hint="I reply within one working day." />
      <TextField {...args} label="Website" type="url" error="Start the address with https://" />
      <TextField {...args} label="Company" type="text" disabled defaultValue="Locked" />
    </div>
  ),
};

/** Keyboard test: Tab moves focus straight into the input. */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Email');
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

/** Interaction test: the error is announced and linked to the input. */
export const ErrorIsAccessible: Story = {
  args: { error: 'This field is required.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('This field is required.');
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
  },
};

/** Interaction test: typing updates the value. */
export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Email');
    await userEvent.type(input, 'hello@vincentiusalan.com');
    await expect(input).toHaveValue('hello@vincentiusalan.com');
  },
};
