import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type SVGProps } from 'react';
import { icons } from '../assets/icons';
import styles from './SortSelect.module.css';

interface SortSelectProps {
  placeholder: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional display-label formatter — the underlying value passed to onChange/matched against `value` is always the raw option string; this only changes what's rendered. */
  getOptionLabel?: (option: string) => string;
}

export function SortSelect({ placeholder, value, options, onChange, icon: Icon, getOptionLabel }: SortSelectProps) {
  const formatLabel = getOptionLabel ?? ((o: string) => o);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(() => Math.max(0, value ? options.indexOf(value) : 0));
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setHighlightIndex(Math.max(0, value ? options.indexOf(value) : 0));
      menuRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const commit = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  const handleClear = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onChange(null);
    setOpen(false);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(options[highlightIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.trigger} ${value ? styles.triggerSelected : ''}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={placeholder}
      >
        {Icon && <Icon className={styles.icon} />}
        <span className={styles.text}>{value ? formatLabel(value) : placeholder}</span>
      </button>

      {value && (
        <button type="button" className={styles.clearButton} onClick={handleClear} aria-label={`Clear ${placeholder}`}>
          &times;
        </button>
      )}

      <icons.chevronDownGray className={styles.chevron} />

      {open && (
        <>
          <button type="button" aria-label="Close" className={styles.backdrop} onClick={() => setOpen(false)} />
          <ul
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            tabIndex={-1}
            aria-label={placeholder}
            onKeyDown={handleListKeyDown}
          >
            {options.map((opt, i) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  className={`${styles.option} ${opt === value ? styles.optionSelected : ''} ${
                    i === highlightIndex ? styles.optionHighlighted : ''
                  }`}
                  onClick={() => commit(opt)}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  {formatLabel(opt)}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
