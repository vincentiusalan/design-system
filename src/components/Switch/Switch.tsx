import { useId, useState } from 'react';
import './Switch.css';

export interface SwitchProps {
  /** Visible label next to the switch. */
  label: string;
  /** Controlled state. Leave undefined for uncontrolled use with `defaultChecked`. */
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/** On/off toggle that takes effect immediately (no submit). Uses `role="switch"`. */
export function Switch({ label, checked, defaultChecked = false, disabled, onChange }: SwitchProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (!isControlled) setInternal(!on);
    onChange?.(!on);
  };

  return (
    <div className="au-switch">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        className="au-switch__track"
        onClick={toggle}
      >
        <span className="au-switch__thumb" />
      </button>
      <label htmlFor={id} className="au-switch__label">
        {label}
      </label>
    </div>
  );
}
