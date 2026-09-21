import { icons } from '../assets/icons';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const DOTS = 'DOTS' as const;
type PageItem = number | typeof DOTS;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageList(current: number, total: number, siblingCount = 1): PageItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= total) {
    return range(1, total);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, total);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < total - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + siblingCount * 2;
    return [...range(1, leftItemCount), DOTS, total];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + siblingCount * 2;
    return [1, DOTS, ...range(total - rightItemCount + 1, total)];
  }

  return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, total];
}

export function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);
  const pageList = getPageList(page, totalPages);

  return (
    <div className={styles.wrap}>
      <p className={styles.summary}>
        Showing {rangeStart.toLocaleString()}&ndash;{rangeEnd.toLocaleString()} of {totalItems.toLocaleString()}
      </p>

      <div className={styles.controls}>
        <button type="button" className={styles.navButton} onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <icons.chevronRight className={styles.prevIcon} />
          Previous
        </button>

        <div className={styles.pageList}>
          {pageList.map((p, i) =>
            p === DOTS ? (
              <span key={`dots-${i}`} className={styles.ellipsis}>
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`${styles.pageButton} ${p === page ? styles.pageButtonActive : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <icons.chevronRight className={styles.nextIcon} />
        </button>
      </div>
    </div>
  );
}
