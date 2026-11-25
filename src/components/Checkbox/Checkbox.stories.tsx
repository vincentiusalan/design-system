import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
Selects zero, one or many independent options, usually inside a form that is submitted later.

**Use when** each option is a yes/no on its own ("Email me about new projects").
**Use a Switch instead** for a setting that applies immediately, and Tabs or radio buttons when only one option may be chosen.

**Do** phrase the label positively so checked means yes; use \`indeterminate\` only for a parent "select all".
**Don't** make the label a question, or use one checkbox to mean two things.`,
      },
    },
  },
  args: { label: 'Email me about new case studies', onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = { args: { label: 'Select all projects', indeterminate: true } };

export const WithHint: Story = { args: { hint: 'About once a month. Unsubscribe any time.' } };

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

/** A parent "select all" driving three children: the real use of `indeterminate`. */
export const SelectAll: Story = {
  render: function Render() {
    const [items, setItems] = useState({ Quiz: true, Permissions: false, Playground: false });
    const values = Object.values(items);
    const all = values.every(Boolean);
    const some = values.some(Boolean);
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <Checkbox
          label="All projects"
          checked={all}
          indeterminate={some && !all}
          onChange={(next) =>
            setItems({ Quiz: next, Permissions: next, Playground: next })
          }
        />
        <div style={{ display: 'grid', gap: 10, paddingLeft: 32 }}>
          {Object.entries(items).map(([name, checked]) => (
            <Checkbox
              key={name}
              label={name}
              checked={checked}
              onChange={(next) => setItems({ ...items, [name]: next })}
            />
          ))}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByLabelText<HTMLInputElement>('All projects');
    await expect(parent.indeterminate).toBe(true);
    await userEvent.click(parent);
    await expect(parent).toBeChecked();
    await expect(canvas.getByLabelText('Playground')).toBeChecked();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox {...args} />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Mixed" indeterminate />
      <Checkbox {...args} label="Disabled" disabled />
    </div>
  ),
};

/** Interaction test: clicking the label toggles the box and reports the new value. */
export const ToggleByLabel: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: args.label });
    await userEvent.click(canvas.getByText(args.label));
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

/** Keyboard test: Tab to the box, Space toggles it. */
export const KeyboardToggle: Story = {
  play: async ({ args, canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: args.label });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};
