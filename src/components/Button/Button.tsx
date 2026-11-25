import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Use one `primary` per view. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Height and padding. `md` is the default touch-friendly size (40px). */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner, keeps the width, and blocks clicks. */
  loading?: boolean;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** Stretch to the container width (mobile CTAs). */
  fullWidth?: boolean;
  children: ReactNode;
}

/** The primary action control. Lime is reserved for the single most important action. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'au-button',
    `au-button--${variant}`,
    `au-button--${size}`,
    fullWidth && 'au-button--full',
    loading && 'is-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="au-button__spinner" aria-hidden="true" />}
      {!loading && icon && <span className="au-button__icon" aria-hidden="true">{icon}</span>}
      <span className="au-button__label">{children}</span>
    </button>
  );
}
