import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `
An on/off setting that takes effect immediately, without a Save button.

**Use when** the change applies right away (dark mode, reduce motion).
**Use a Checkbox instead** inside a form that is submitted later, or for picking several items.

**Do** label the setting, not the action ("Reduce motion", not "Turn on reduce motion").
**Don't** use a switch for something that needs confirmation or takes time to apply.`,
      },
    },
  },
  args: { label: 'Reduce motion', onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Dark: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch {...args} label="Reduce motion" />
      <Switch {...args} label="Dark mode" defaultChecked />
      <Switch {...args} label="Beta features" disabled />
    </div>
  ),
};

/**
 * Controlled by Storybook args: toggling the switch updates the `checked`
 * control in the panel, and editing the control updates the switch.
 */
export const Controlled: Story = {
  args: { checked: false },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Switch
        {...args}
        onChange={(next) => {
          args.onChange?.(next);
          updateArgs({ checked: next });
        }}
      />
    );
  },
};

/** Interaction test: clicking the label toggles the switch and reports the new value. */
export const ToggleByLabel: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Reduce motion' });
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(canvas.getByText('Reduce motion'));
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};
