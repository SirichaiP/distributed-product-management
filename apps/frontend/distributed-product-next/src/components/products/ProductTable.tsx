// src/components/products/ProductTable.tsx
"use client";

import { ProductResponse } from "@/types/product.type";
import Image from "next/image";
interface ProductTableProps {
  products: ProductResponse[];
  total: number;
  onEdit: (product: ProductResponse) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/600x400?text=Product";

export default function ProductTable({
  products,
  total,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="card product-list-card">
      <div className="card-header product-list-header">
        <h3>Product List</h3>
        <span>Showing {total} of {total} entries</span>
      </div>

      <div className="product-table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>

                <td>
              <div className="product-thumb">
  <Image
    src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
    alt={product.name}
    width={48}
    height={48}
    className="product-thumb-image"
    unoptimized
    onError={(e) => {
      e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
    }}
  />
</div>
                </td>

                <td>
                  <div className="product-name-cell">
                    <strong>{product.name}</strong>
                    <span>SKU: {product.sku}</span>
                  </div>
                </td>

                <td>{product.categoryName ?? "-"}</td>

                <td>
                  <strong>
                    ฿{Number(product.price).toFixed(2)}
                  </strong>
                </td>

                <td>
                  <span
                    className={
                      Number(product.stockQuantity) <= 10
                        ? "stock-low"
                        : "stock-good"
                    }
                  >
                    {product.stockQuantity} units
                  </span>
                </td>

                <td>
                  <span
                    className={
                      product.isActive
                        ? "status-badge active"
                        : "status-badge inactive"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                   
                    <button
                      type="button"
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => onEdit(product)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => onDelete(product.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="empty-table">No products found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

<div className="product-list-footer">
  <span>
    {total > 0
      ? `Showing 1 to ${total} of ${total} entries`
      : "Showing 0 to 0 of 0 entries"}
  </span>

  <div className="product-pagination">
    <button type="button" className="page-btn" disabled>
      &lt;
    </button>

    <button type="button" className="page-btn active">
      1
    </button>

    <button type="button" className="page-btn" disabled>
      &gt;
    </button>
  </div>
</div>
    </div>
  );
}