import { Category } from "@/types/category.type";

interface CategoryStatsProps {
  categories: Category[];
}

export default function CategoryStats({ categories }: CategoryStatsProps) {
  const total = categories.length;
  const active = categories.filter((x) => x.isActive).length;
  const inactive = total - active;
  const totalProducts = categories.reduce(
    (sum, item) => sum + (item.productCount ?? 0),
    0
  );

  return (
    <div className="stats-row">
      <div className="mini-stat">
        <div className="mini-stat-icon icon-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <div>
          <div className="mini-stat-label">Total Categories</div>
          <div className="mini-stat-value">{total}</div>
        </div>
      </div>

      <div className="mini-stat">
        <div className="mini-stat-icon icon-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
          </svg>
        </div>
        <div>
          <div className="mini-stat-label">Active</div>
          <div className="mini-stat-value">{active}</div>
        </div>
      </div>

      <div className="mini-stat">
        <div className="mini-stat-icon icon-yellow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <div className="mini-stat-label">Inactive</div>
          <div className="mini-stat-value">{inactive}</div>
        </div>
      </div>

      {/* <div className="mini-stat">
        <div className="mini-stat-icon icon-red">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
          </svg>
        </div>
        <div>
          <div className="mini-stat-label">Total Products</div>
          <div className="mini-stat-value">{totalProducts}</div>
        </div>
      </div> */}
    </div>
  );
}