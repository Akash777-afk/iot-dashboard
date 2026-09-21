import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type SVGProps } from 'react';
import { icons } from '../assets/icons';
import styles from './FilterSelect.module.css';

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  showDot?: boolean;
}

export function FilterSelect({ label, value, options, onChange, icon: Icon, showDot }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(() => Math.max(0, options.indexOf(value)));
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setHighlightIndex(Math.max(0, options.indexOf(value)));
      menuRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const commit = (opt: string) => {
    onChange(opt);
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
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        {showDot && <span className={styles.dot} />}
        {Icon && <Icon className={styles.icon} />}
        <span className={styles.label}>{label}:</span>
        <span className={styles.value}>{value}</span>
        <icons.chevronDownGray className={styles.chevron} />
      </button>

      {open && (
        <>
          <button type="button" aria-label="Close" className={styles.backdrop} onClick={() => setOpen(false)} />
          <ul
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
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
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
