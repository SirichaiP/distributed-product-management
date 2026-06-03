import { Category } from "@/types/category.type";

interface CategoryDetailPanelProps {
  category?: Category | null;
  canWrite: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("th-TH");
}

export default function CategoryDetailPanel({
  category,
  canWrite,
  onEdit,
  onDelete,
}: CategoryDetailPanelProps) {
  if (!category) {
    return (
      <div className="detail-panel">
        <div className="card" style={{ padding: 24, color: "var(--muted)" }}>
          Select a category to view details
        </div>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        <div className="detail-header">
          <div className="detail-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>

          <div className="detail-name">{category.name}</div>
          <span className="detail-badge">
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-row">
            <span className="detail-label">Slug</span>
            <span
              className="detail-value"
              style={{
                fontFamily: "monospace",
                fontSize: 12.5,
                color: "var(--muted)",
              }}
            >
              {category.slug}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span
              className="detail-value"
              style={{ fontSize: 13, color: "var(--muted)" }}
            >
              {category.description || "-"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total Products</span>
            <span
              className="detail-value"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {category.productCount ?? 0}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Active Products</span>
            <span
              className="detail-value"
              style={{ color: "var(--success)", fontWeight: 600 }}
            >
              {category.activeProductCount ?? 0}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Created</span>
            <span
              className="detail-value"
              style={{ fontSize: 12.5, color: "var(--muted)" }}
            >
              {formatDate(category.createdAt)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Last Updated</span>
            <span
              className="detail-value"
              style={{ fontSize: 12.5, color: "var(--muted)" }}
            >
              {formatDate(category.updatedAt)}
            </span>
          </div>

          {canWrite && (
            <div className="detail-actions">
              <button className="btn-outline" onClick={() => onEdit(category)}>
                Edit
              </button>

              <button
                className="btn-danger-outline"
                onClick={() => onDelete(category)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}