interface StockToolbarProps {
  search: string;
  stockFilter: string;
  categoryFilter: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onStockFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

export default function StockToolbar({
  search,
  stockFilter,
  categoryFilter,
  categories,
  onSearchChange,
  onStockFilterChange,
  onCategoryFilterChange,
}: StockToolbarProps) {
  return (
    <div className="stock-toolbar">
      <div className="stock-search-box">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search product or SKU…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <select
        className="stock-filter-select"
        value={stockFilter}
        onChange={(event) => onStockFilterChange(event.target.value)}
      >
        <option value="all">All stock status</option>
        <option value="ok">In stock</option>
        <option value="warn">Low stock</option>
        <option value="low">Out of stock</option>
      </select>

      <select
        className="stock-filter-select"
        value={categoryFilter}
        onChange={(event) => onCategoryFilterChange(event.target.value)}
      >
        <option value="all">All categories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}