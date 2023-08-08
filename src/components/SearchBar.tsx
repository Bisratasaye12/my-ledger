interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  const inputId = 'inventory-search';

  return (
    <div className="search-bar">
      <label htmlFor={inputId}>Search crops</label>
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder="Filter by crop or variety"
        onChange={(event) => onChange(event.target.value)}
        aria-describedby="search-results-count"
      />
      <p id="search-results-count" className="search-bar__count" aria-live="polite">
        Showing {resultCount} of {totalCount} items
      </p>
    </div>
  );
}
