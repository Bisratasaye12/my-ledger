import { useMemo, useState } from 'react';
import type { CategoryFilter, InventoryItem } from '../types/inventory';
import { StatusBadge } from './StatusBadge';
import { SearchBar } from './SearchBar';
import { BulkActionBar } from './BulkActionBar';

interface InventoryTableProps {
  items: InventoryItem[];
}

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'vegetable', label: 'Vegetables' },
  { value: 'fruit', label: 'Fruits' },
  { value: 'grain', label: 'Grains' },
  { value: 'herb', label: 'Herbs' },
];

export function InventoryTable({ items }: InventoryTableProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = filterQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.crop.toLowerCase().includes(normalizedQuery) ||
        item.variety.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [items, filterQuery, categoryFilter]);

  const handleSearchChange = (value: string) => {
    setFilterQuery(value);
  };

  const toggleRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id],
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = filteredItems.map((item) => item.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...visibleIds])));
  };

  const handleMarkLow = () => {
    // Bulk action stub — updates are handled upstream in a future iteration.
    setSelectedIds([]);
  };

  const visibleSelectedCount = filteredItems.filter((item) =>
    selectedIds.includes(item.id),
  ).length;

  const allVisibleSelected =
    filteredItems.length > 0 && visibleSelectedCount === filteredItems.length;

  return (
    <section className="inventory-panel" aria-labelledby="inventory-heading">
      <header className="inventory-panel__header">
        <div>
          <h2 id="inventory-heading">Live inventory</h2>
          <p className="inventory-panel__subtitle">
            Track cooperative stock levels and prepare bulk updates.
          </p>
        </div>
      </header>

      <div className="inventory-panel__filters">
        <SearchBar
          value={filterQuery}
          onChange={handleSearchChange}
          resultCount={filteredItems.length}
          totalCount={items.length}
        />

        <div className="category-filter">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.length}
        onMarkLow={handleMarkLow}
        onClearSelection={() => setSelectedIds([])}
      />

      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all visible rows"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                />
              </th>
              <th scope="col">Crop</th>
              <th scope="col">Variety</th>
              <th scope="col">Category</th>
              <th scope="col">Quantity (lbs)</th>
              <th scope="col">Unit price</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="inventory-table__empty">
                  No inventory matches the current filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const checkboxId = `select-${item.id}`;

                return (
                  <tr key={item.id} data-selected={selectedIds.includes(item.id)}>
                    <td>
                      <input
                        id={checkboxId}
                        type="checkbox"
                        aria-label={`Select ${item.crop} ${item.variety}`}
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                      />
                    </td>
                    <td>{item.crop}</td>
                    <td>{item.variety}</td>
                    <td>{item.category}</td>
                    <td>{item.quantityLbs.toLocaleString()}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
