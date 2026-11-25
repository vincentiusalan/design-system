import { useEffect, useId, useRef, type ReactNode } from 'react';
import './Dialog.css';

export interface DialogProps {
  /** Whether the dialog is shown. The parent owns this state. */
  open: boolean;
  /** Called when the dialog asks to close: Esc, the × button, or a click on the backdrop. */
  onClose: () => void;
  /** Heading, also the dialog's accessible name. */
  title: string;
  /** One sentence under the title; becomes the accessible description. */
  description?: string;
  /** Body content. Scrolls if it is taller than the screen. */
  children?: ReactNode;
  /** Footer buttons, primary action last. */
  actions?: ReactNode;
}

/**
 * A modal dialog built on the native `<dialog>` element and `showModal()`,
 * which gives a real focus trap, inert background and top-layer stacking.
 * Focus returns to whatever opened it.
 */
export function Dialog({ open, onClose, title, description, children, actions }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="au-dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={() => {
        returnFocusTo.current?.focus();
        if (open) onClose();
      }}
      // Handle Esc ourselves so behaviour is identical across browsers and in tests.
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="au-dialog__surface">
        <header className="au-dialog__header">
          <div>
            <h2 id={titleId} className="au-dialog__title">{title}</h2>
            {description && <p id={descId} className="au-dialog__description">{description}</p>}
          </div>
          <button type="button" className="au-dialog__close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        {children && (
          // Focusable so keyboard users can scroll long content.
          <div className="au-dialog__body" tabIndex={0}>
            {children}
          </div>
        )}
        {actions && <footer className="au-dialog__footer">{actions}</footer>}
      </div>
    </dialog>
  );
}
