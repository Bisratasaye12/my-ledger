interface BulkActionBarProps {
  selectedCount: number;
  onMarkLow: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({ selectedCount, onMarkLow, onClearSelection }: BulkActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bulk-action-bar" role="region" aria-label="Bulk actions">
      <p aria-live="polite">{selectedCount} item{selectedCount === 1 ? '' : 's'} selected</p>
      <button type="button" onClick={onMarkLow}>
        Mark selected as low stock
      </button>
      <button type="button" onClick={onClearSelection}>
        Clear selection
      </button>
    </div>
  );
}
