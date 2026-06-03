// src/components/products/ProductToolbar.tsx
import { CategoryOption } from "@/types/product.type";

interface ProductToolbarProps {
  search: string;
  categoryFilter: string;
  statusFilter: string;
  categories: CategoryOption[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAddClick: () => void;
}

export default function ProductToolbar({
  search,
  categoryFilter,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAddClick,
}: ProductToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="btn-primary" onClick={onAddClick}>
          <span>＋</span>
          Add Product
        </button>
      </div>

      <div className="toolbar-right">
        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={statusFilter}
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