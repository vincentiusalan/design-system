import { useEffect, useId, useRef, type InputHTMLAttributes } from 'react';
import './Checkbox.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  /** Visible label. Clicking it toggles the box. */
  label: string;
  /** Helper text under the label. */
  hint?: string;
  /**
   * Mixed state, e.g. a "select all" when only some items are selected.
   * It is visual only and is cleared by the next click.
   */
  indeterminate?: boolean;
  /** Called with the new checked value. */
  onChange?: (checked: boolean) => void;
}

/** A native checkbox styled with tokens, so keyboard, forms and screen readers work for free. */
export function Checkbox({ label, hint, indeterminate = false, onChange, id, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` has no HTML attribute; it can only be set as a DOM property.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className="au-checkbox">
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="au-checkbox__input"
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <div className="au-checkbox__text">
        <label htmlFor={inputId} className="au-checkbox__label">
          {label}
        </label>
        {hint && (
          <p id={hintId} className="au-checkbox__hint">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
