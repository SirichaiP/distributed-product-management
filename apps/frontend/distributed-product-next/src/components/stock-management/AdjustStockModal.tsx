"use client";

// src/components/stock-management/AdjustStockModal.tsx

import { useEffect, useMemo, useState } from "react";

import { stockService } from "@/services/stock.service";
import type { AdjustStockType, StockProduct } from "@/types/stock.type";

interface AdjustStockModalProps {
  product: StockProduct | null;
  onClose: () => void;
  onSuccess: (productId: string, newStock: number) => void;
}

export default function AdjustStockModal({
  product,
  onClose,
  onSuccess,
}: AdjustStockModalProps) {
  if (!product) return null;

  return (
    <AdjustStockModalContent
      key={product.id}
      product={product}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

interface AdjustStockModalContentProps {
  product: StockProduct;
  onClose: () => void;
  onSuccess: (productId: string, newStock: number) => void;
}

function AdjustStockModalContent({
  product,
  onClose,
  onSuccess,
}: AdjustStockModalContentProps) {
  const [type, setType] = useState<AdjustStockType>("add");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const previewStock = useMemo(() => {
    if (type === "add") {
      return product.stock + quantity;
    }

    if (type === "subtract") {
      return Math.max(0, product.stock - quantity);
    }

    return quantity;
  }, [product.stock, type, quantity]);

  async function handleSubmit() {
    if (quantity <= 0) return;

    try {
      setSaving(true);

      await stockService.adjustStock(product.id, {
        quantity,
        type,
      });

      onSuccess(product.id, previewStock);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stock-modal-overlay open" onMouseDown={onClose}>
      <div
        className="stock-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="stock-modal-header">
          <div>
            <h3>Adjust stock</h3>
            <p>Add, subtract, or set stock quantity</p>
          </div>

          <button type="button" className="stock-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="stock-modal-body">
          <div className="stock-product-strip">
            <div className="stock-product-strip-icon">📦</div>

            <div>
              <div className="stock-product-strip-name">{product.name}</div>
              <div className="stock-product-strip-meta">SKU: {product.sku}</div>
            </div>

            <div className="stock-product-strip-stock">
              <strong>{product.stock} units</strong>
              <span>Current stock</span>
            </div>
          </div>

          <div className="stock-form-group">
            <label>Adjustment type</label>

            <div className="stock-type-tabs">
              <button
                type="button"
                className={type === "add" ? "active add" : ""}
                onClick={() => setType("add")}
              >
                Add
              </button>

              <button
                type="button"
                className={type === "subtract" ? "active subtract" : ""}
                onClick={() => setType("subtract")}
              >
                Subtract
              </button>

              <button
                type="button"
                className={type === "set" ? "active set" : ""}
                onClick={() => setType("set")}
              >
                Set exact
              </button>
            </div>
          </div>

          <div className="stock-form-group">
            <label>Quantity</label>

            <div className="stock-qty-wrap">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setQuantity(Number.isNaN(value) ? 1 : Math.max(1, value));
                }}
              />

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="stock-form-group">
            <label>Reason / note</label>

            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              <option value="">Select reason (optional)</option>
              <option value="purchase">Restock from purchase</option>
              <option value="return">Customer return</option>
              <option value="damage">Damaged / expired</option>
              <option value="theft">Shrinkage / theft</option>
              <option value="correction">Inventory correction</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="stock-preview-chip">
            <span>New stock after adjustment</span>
            <strong>{previewStock} units</strong>
          </div>
        </div>

        <div className="stock-modal-footer">
          <button
            type="button"
            className="stock-btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="stock-btn-primary"
            disabled={saving || quantity <= 0}
            onClick={handleSubmit}
          >
            {saving ? "Processing..." : "Confirm adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
}