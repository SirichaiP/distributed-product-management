import { CartItem } from "@/types/shop.type";

interface CheckoutModalProps {
  open: boolean;
  success: boolean;
  loading: boolean;
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CheckoutModal({
  open,
  success,
  loading,
  orderId,
  items,
  totalAmount,
  onClose,
  onConfirm,
}: CheckoutModalProps) {
  if (!open) return null;

  return (
    <div className="checkout-overlay" role="dialog" aria-modal="true">
      <div className="checkout-modal">
        <div className="checkout-modal-header">
          <div>
            <h2>{success ? "สั่งซื้อสำเร็จ" : "ยืนยันคำสั่งซื้อ"}</h2>
            <p>
              {success
                ? "ระบบสร้างคำสั่งซื้อเรียบร้อยแล้ว"
                : "ตรวจสอบรายการสินค้าก่อนยืนยัน"}
            </p>
          </div>

          <button
            type="button"
            className="checkout-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="checkout-success">
            <div className="checkout-success-icon">✅</div>
            <div className="checkout-success-title">Order Created</div>

            <div className="checkout-order-id">
              Order ID: <strong>{orderId || "-"}</strong>
            </div>

            <button
              type="button"
              className="checkout-primary-btn"
              onClick={onClose}
            >
              ปิด
            </button>
          </div>
        ) : (
          <>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.productId} className="checkout-item">
                  <div>
                    <div className="checkout-item-name">
                      {item.productName}
                    </div>

                    <div className="checkout-item-meta">
                      ฿{item.unitPrice.toLocaleString("th-TH")} ×{" "}
                      {item.quantity}
                    </div>
                  </div>

                  <strong>
                    ฿
                    {(item.unitPrice * item.quantity).toLocaleString("th-TH")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>ยอดรวมทั้งหมด</span>
              <strong>฿{totalAmount.toLocaleString("th-TH")}</strong>
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="checkout-secondary-btn"
                onClick={onClose}
                disabled={loading}
              >
                ยกเลิก
              </button>

              <button
                type="button"
                className="checkout-primary-btn"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "กำลังสร้างคำสั่งซื้อ..." : "ยืนยัน Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}