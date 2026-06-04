"use client";

// src/components/stock-management/ReserveStockModal.tsx

import { FormEvent, useEffect, useMemo, useState } from "react";
import { stockService } from "@/services/stock.service";
import type { StockProduct } from "@/types/stock.type";

interface ReserveStockModalProps {
  product: StockProduct | null;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function ReserveStockModal({
  product,
  onClose,
  onSuccess,
}: ReserveStockModalProps) {
  const [quantity, setQuantity] = useState("1");
  const [orderId, setOrderId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;

    queueMicrotask(() => {
      setQuantity("1");
      setOrderId("");
      setSaving(false);
      setError(null);
    });
  }, [product]);

  const availableStock = useMemo(() => {
    if (!product) return 0;

    if (typeof product.available === "number") {
      return product.available;
    }

    return Math.max(product.stock - product.reserved, 0);
  }, [product]);

  if (!product) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) return;

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("กรุณาระบุจำนวนที่ต้องการจองให้ถูกต้อง");
      return;
    }

    if (parsedQuantity > availableStock) {
      setError(
        `จำนวนที่จองมากกว่าสินค้าพร้อมขาย ปัจจุบันพร้อมขาย ${availableStock.toLocaleString(
          "th-TH"
        )} ชิ้น`
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

const fallbackOrderId = "00000000-0000-0000-0000-000000000000";
const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

await stockService.reserveStock(product.id, {
  orderId: orderId.trim() || fallbackOrderId,
  quantity: parsedQuantity,
  expiresAt,
});

      await onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "ไม่สามารถจอง Stock ได้ กรุณาลองใหม่อีกครั้ง";

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
            <h2 className="stock-modal-title">Reserve Stock</h2>
            <p className="stock-modal-subtitle">
              จองสินค้าเพื่อล็อกจำนวนไว้สำหรับ Order
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
              <span>Stock:</span>
              <strong>{product.stock.toLocaleString("th-TH")}</strong>
              <span>· Reserved:</span>
              <strong>{product.reserved.toLocaleString("th-TH")}</strong>
              <span>· Available:</span>
              <strong>{availableStock.toLocaleString("th-TH")}</strong>
            </div>
          </div>

          {error && <div className="stock-alert-danger">{error}</div>}

          <div className="stock-form-group">
            <label htmlFor="reserveQuantity" className="stock-form-label">
              Quantity
            </label>

            <input
              id="reserveQuantity"
              type="number"
              min={1}
              max={Math.max(availableStock, 1)}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={saving}
              placeholder="จำนวนที่ต้องการจอง"
              className="stock-form-control"
            />

            <p className="stock-form-help">
              จำนวนที่จองต้องไม่เกินสินค้าพร้อมขาย
            </p>
          </div>

          <div className="stock-form-group">
            <label htmlFor="reserveOrderId" className="stock-form-label">
              Order ID
            </label>

            <input
              id="reserveOrderId"
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              disabled={saving}
              placeholder="ไม่ใส่ก็ได้ ถ้า backend ไม่บังคับ"
              className="stock-form-control"
            />

            <p className="stock-form-help">
              ใช้สำหรับผูกการจอง Stock กับ Order ถ้ามี
            </p>
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
              disabled={saving || availableStock <= 0}
            >
              {saving ? "Saving..." : "Reserve stock"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}