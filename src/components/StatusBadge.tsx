import type { StockStatus } from '../types/inventory';

const LABELS: Record<StockStatus, string> = {
  'in-stock': 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
};

interface StatusBadgeProps {
  status: StockStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`} aria-label={`Stock status: ${LABELS[status]}`}>
      {LABELS[status]}
    </span>
  );
}
