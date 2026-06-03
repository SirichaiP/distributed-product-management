import { ShopCategory, ShopCategoryOption } from "@/types/shop.type";

interface ShopFiltersProps {
  searchText: string;
  currentCategory: ShopCategory;
  categories: ShopCategoryOption[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ShopCategory) => void;
}

export default function ShopFilters({
  searchText,
  currentCategory,
  categories,
  onSearchChange,
  onCategoryChange,
}: ShopFiltersProps) {
  return (
    <div className="shop-controls">
      <div className="shop-search-box">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ค้นหาสินค้า..."
        />
      </div>

      <div className="shop-filter-tabs">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={
              currentCategory === category.value
                ? "shop-filter-tab active"
                : "shop-filter-tab"
            }
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}