// src/components/stock-management/StockTable.tsx

import type { StockProduct, StockStatus } from "@/types/stock.type";

interface StockTableProps {
  products: StockProduct[];
  loading: boolean;
  onAdjust: (product: StockProduct) => void;
  onReserve: (product: StockProduct) => void;
}

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "low";
  if (stock < 10) return "warn";
  return "ok";
}

function getStockBarWidth(stock: number) {
  return Math.min(100, Math.round((stock / 150) * 100));
}

export default function StockTable({
  products,
  loading,
  onAdjust,
  onReserve,
}: StockTableProps) {
  if (loading) {
    return <div className="stock-loading">Loading stock data...</div>;
  }

  if (products.length === 0) {
    return <div className="stock-empty">No products found.</div>;
  }

  return (
    <div className="stock-table-wrap">
      <table className="stock-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => {
            const stockStatus = getStockStatus(product.stock);
            const width = getStockBarWidth(product.stock);

            return (
              <tr key={product.id}>
                <td>{index + 1}</td>

                <td>
                  <div className="stock-thumb">📦</div>
                </td>

                <td>
                  <div className="stock-product-name">{product.name}</div>
                  <div className="stock-product-sku">{product.sku}</div>
                </td>

                <td>{product.category}</td>

                <td className="stock-price">
                  ฿
                  {product.price.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                <td>
                  <div className="stock-cell">
                    <span className={`stock-count ${stockStatus}`}>
                      {product.stock} units
                    </span>

                    <div className="stock-bar">
                      <div
                        className={`stock-bar-fill ${stockStatus}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={
                      product.status === "Active"
                        ? "stock-badge green"
                        : "stock-badge red"
                    }
                  >
                    {product.status}
                  </span>
                </td>

                <td>
                  <div className="stock-action-btns">
                    <button
                      type="button"
                      className="stock-action-btn adjust"
                      title="Adjust stock"
                      onClick={() => onAdjust(product)}
                    >
                      ⚙️
                    </button>

                    <button
                      type="button"
                      className="stock-action-btn reserve"
                      title="Reserve stock"
                      onClick={() => onReserve(product)}
                    >
                      🛡️
                    </button>

                    <button
                      type="button"
                      className="stock-action-btn view"
                      title="View product"
                    >
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}