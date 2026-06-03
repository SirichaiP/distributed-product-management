import { Category } from "@/types/category.type";

interface CategoryTableProps {
  categories: Category[];
  selectedId?: string;
  canWrite: boolean;
  onSelect: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  selectedId,
  canWrite,
  onSelect,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Category List</span>
        <span className="result-count">{categories.length} categories</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              {/* <th>Products</th> */}
              <th>Status</th>
              {canWrite && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.id}
                className={selectedId === category.id ? "selected" : ""}
                onClick={() => onSelect(category)}
              >
                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {index + 1}
                </td>

                <td>
                  <div className="cat-cell">
                    <div
                      className="cat-icon"
                      style={{
                        background: category.isActive
                          ? "rgba(37,99,235,0.12)"
                          : "rgba(100,116,139,0.12)",
                        color: category.isActive
                          ? "var(--primary)"
                          : "var(--muted)",
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>

                    <div>
                      <div className="cat-name">{category.name}</div>
                      <div className="cat-slug">{category.slug}</div>
                    </div>
                  </div>
                </td>

                <td style={{ color: "var(--muted)", fontSize: 13 }}>
                  {category.description || "-"}
                </td>

                {/* <td>
                  <span
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {category.productCount ?? 0}
                  </span>
                </td> */}

                <td>
                  <span
                    className={`badge ${
                      category.isActive ? "badge-green" : "badge-red"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {canWrite && (
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(category);
                        }}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button
                        className="action-btn btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(category);
                        }}
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={canWrite ? 6 : 5}
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: 28,
                  }}
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Showing {categories.length === 0 ? 0 : 1} to {categories.length} of{" "}
          {categories.length} entries
        </span>

        <div className="pagination-btns">
          <button className="page-btn" disabled>
            1
          </button>
        </div>
      </div>
    </div>
  );
}