import type { ReactNode } from 'react';
import './Badge.css';

export interface BadgeProps {
  /** `neutral` for metadata, `accent` for highlights, `live` for status with a pulsing dot. */
  tone?: 'neutral' | 'accent' | 'live';
  /** Monospace for numbers and durations (e.g. read time). */
  mono?: boolean;
  children: ReactNode;
}

/** Small, non-interactive label for metadata such as role, year or read time. */
export function Badge({ tone = 'neutral', mono = false, children }: BadgeProps) {
  return (
    <span className={`au-badge au-badge--${tone}${mono ? ' au-badge--mono' : ''}`}>
      {tone === 'live' && <span className="au-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
