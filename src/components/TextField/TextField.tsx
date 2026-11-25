import { useId, type InputHTMLAttributes } from 'react';
import './TextField.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. Always required: placeholders are not labels. */
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message. When set, replaces the hint and marks the field invalid. */
  error?: string;
}

/** Labelled text input with hint and error states, wired up for screen readers. */
export function TextField({ label, hint, error, id, required, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={`au-field${error ? ' is-invalid' : ''}`}>
      <label className="au-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="au-field__required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        className="au-field__input"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message && (
        <p id={messageId} className="au-field__message" role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
