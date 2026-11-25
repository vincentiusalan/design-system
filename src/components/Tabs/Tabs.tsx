import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** The tabs, in order. */
  items: TabItem[];
  /** Accessible name for the tab list, e.g. "Case study sections". */
  label: string;
  /** Id of the tab selected on first render. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the id of the newly selected tab. */
  onChange?: (id: string) => void;
}

/**
 * Switches between views of the same content without leaving the page.
 * Follows the WAI-ARIA tabs pattern: one Tab stop for the whole list,
 * arrow keys / Home / End move between tabs, selection follows focus.
 */
export function Tabs({ items, label, defaultValue, onChange }: TabsProps) {
  const baseId = useId();
  const enabled = items.filter((t) => !t.disabled);
  const [selected, setSelected] = useState(defaultValue ?? enabled[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string, focus = false) => {
    setSelected(id);
    onChange?.(id);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = enabled.findIndex((t) => t.id === selected);
    const last = enabled.length - 1;
    const next =
      e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next === -1) return;
    e.preventDefault();
    select(enabled[next].id, true);
  };

  return (
    <div className="au-tabs">
      <div role="tablist" aria-label={label} className="au-tabs__list" onKeyDown={onKeyDown}>
        {items.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className="au-tabs__tab"
              onClick={() => select(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== selected}
          tabIndex={0}
          className="au-tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
