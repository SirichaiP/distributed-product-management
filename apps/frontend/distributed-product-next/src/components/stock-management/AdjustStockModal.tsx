"use client";

// src/components/stock-management/AdjustStockModal.tsx

import { FormEvent, useEffect, useState } from "react";
import { stockService } from "@/services/stock.service";
import type { StockProduct } from "@/types/stock.type";

interface AdjustStockModalProps {
  product: StockProduct | null;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function AdjustStockModal({
  product,
  onClose,
  onSuccess,
}: AdjustStockModalProps) {
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;

    queueMicrotask(() => {
      setQuantity("1");
      setReason("");
      setSaving(false);
      setError(null);
    });
  }, [product]);

  if (!product) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) return;

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity === 0) {
      setError("กรุณาระบุจำนวนที่ต้องการปรับ Stock ให้ถูกต้อง");
      return;
    }

    try {
      setSaving(true);
      setError(null);

  await stockService.adjustStock(product.id, {
  quantity: parsedQuantity,
  type: parsedQuantity > 0 ? "Increase" : "Decrease",
});
      await onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "ไม่สามารถปรับ Stock ได้ กรุณาลองใหม่อีกครั้ง";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;
    onClose();
  }

  return (
    <div className="stock-modal-backdrop">
      <section className="stock-modal" role="dialog" aria-modal="true">
        <div className="stock-modal-header">
          <div>
            <h2 className="stock-modal-title">Adjust Stock</h2>
            <p className="stock-modal-subtitle">
              ปรับจำนวนสินค้าในคลังสำหรับรายการนี้
            </p>
          </div>

          <button
            type="button"
            className="stock-modal-close"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stock-modal-body">
          <div className="stock-product-box">
            <div className="stock-product-name">{product.name}</div>

            <div className="stock-product-meta">
              <span>SKU: {product.sku}</span>
              <span>Current stock:</span>
              <strong>{product.stock.toLocaleString("th-TH")}</strong>
            </div>
          </div>

          {error && <div className="stock-alert-danger">{error}</div>}

          <div className="stock-form-group">
            <label htmlFor="adjustQuantity" className="stock-form-label">
              Quantity
            </label>

            <input
              id="adjustQuantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={saving}
              placeholder="เช่น 10 หรือ -5"
              className="stock-form-control"
            />

            <p className="stock-form-help">
              ใส่เลขบวกเพื่อเพิ่ม Stock หรือเลขลบเพื่อลด Stock
            </p>
          </div>

          <div className="stock-form-group">
            <label htmlFor="adjustReason" className="stock-form-label">
              Reason
            </label>

            <textarea
              id="adjustReason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={saving}
              placeholder="เช่น รับสินค้าเข้า, ปรับยอดจากการตรวจนับ, สินค้าเสียหาย"
              className="stock-form-control stock-textarea"
              rows={4}
            />
          </div>

          <div className="stock-modal-actions">
            <button
              type="button"
              className="stock-btn-secondary"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="stock-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save adjustment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}