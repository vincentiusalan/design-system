import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

type DialogArgs = ComponentProps<typeof Dialog>;

/** Real usage: a trigger button owns the `open` state. */
function DialogDemo({ trigger = 'Delete draft', ...args }: DialogArgs & { trigger?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    args.onClose();
  };
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Dialog {...args} open={open} onClose={close} />
    </>
  );
}

const openDialog = async (canvasElement: HTMLElement, trigger: RegExp) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
};

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: `
A modal that interrupts the page to confirm a decision or collect a small amount of input.

**Use when** the user must decide before continuing, especially for destructive actions ("Delete draft?").
**Don't use** for information that could sit on the page, for long forms, or for success messages (use an inline message).

**Do** make the title a question or the outcome, and name the action on the button ("Delete draft", not "OK"). Put the primary action last.
**Don't** open a dialog on page load, or stack one dialog on another.

Built on native \`<dialog>\` + \`showModal()\`: focus is trapped inside, **Esc** or a click on the backdrop closes it, and focus returns to the trigger.`,
      },
    },
  },
  args: {
    open: false,
    title: 'Delete this draft?',
    description: 'The case study and its 12 images will be removed. This can’t be undone.',
    onClose: fn(),
  },
  argTypes: { open: { control: false }, actions: { control: false }, children: { control: false } },
  render: (args) => (
    <DialogDemo
      {...args}
      actions={
        <>
          <Button variant="ghost" onClick={args.onClose}>Keep draft</Button>
          <Button variant="danger">Delete draft</Button>
        </>
      }
    />
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens itself in the canvas so you can see it. On the Docs page, click the button. */
export const Destructive: Story = {
  play: ({ canvasElement }) => openDialog(canvasElement, /delete draft/i),
};

export const Confirm: Story = {
  args: {
    title: 'Send this message?',
    description: 'It goes to Alan’s inbox. You’ll get a copy by email.',
  },
  render: (args) => (
    <DialogDemo
      {...args}
      trigger="Send message"
      actions={
        <>
          <Button variant="ghost" onClick={args.onClose}>Edit</Button>
          <Button>Send message</Button>
        </>
      }
    />
  ),
  play: ({ canvasElement }) => openDialog(canvasElement, /send message/i),
};

/** Long content scrolls inside the body; header and actions stay visible. */
export const LongContent: Story = {
  args: { title: 'Privacy', description: 'How this site handles your data.' },
  render: (args) => (
    <DialogDemo
      {...args}
      trigger="Read privacy note"
      actions={<Button onClick={args.onClose}>Got it</Button>}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <p key={i}>
          Paragraph {i + 1}. Analytics are anonymous and cookie-free. Messages you send are stored
          only to reply to you and are deleted after twelve months.
        </p>
      ))}
    </DialogDemo>
  ),
  play: ({ canvasElement }) => openDialog(canvasElement, /read privacy note/i),
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: ({ canvasElement }) => openDialog(canvasElement, /delete draft/i),
};

/** Keyboard test: focus moves inside, Esc closes, focus returns to the trigger. */
export const EscapeClosesAndRestoresFocus: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /delete draft/i });
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole('dialog', { name: 'Delete this draft?' });
    await expect(dialog).toHaveAccessibleDescription(/can’t be undone/);
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onClose).toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
  },
};

/** Interaction test: a click on the backdrop closes the dialog. */
export const BackdropCloses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await openDialog(canvasElement, /delete draft/i);
    const dialog = await canvas.findByRole('dialog');
    // A real click on ::backdrop is dispatched to the <dialog> element itself; do exactly that.
    await userEvent.pointer({ keys: '[MouseLeft]', target: dialog });
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
