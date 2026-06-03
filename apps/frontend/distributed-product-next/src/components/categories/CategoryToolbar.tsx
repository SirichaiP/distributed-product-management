interface CategoryToolbarProps {
  search: string;
  status: string;
  canWrite: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddClick: () => void;
}

export default function CategoryToolbar({
  search,
  status,
  canWrite,
  onSearchChange,
  onStatusChange,
  onAddClick,
}: CategoryToolbarProps) {
  return (
    <div className="toolbar">
      {canWrite && (
        <button className="btn-primary" onClick={onAddClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}