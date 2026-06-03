import { CartItem } from "@/types/shop.type";

interface CartPanelProps {
  items: CartItem[];
  totalQty: number;
  totalAmount: number;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export default function CartPanel({
  items,
  totalQty,
  totalAmount,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout,
}: CartPanelProps) {
  const isEmpty = items.length === 0;

  return (
    <aside className="shop-cart-panel">
      <div className="shop-cart-header">
        <div>
          <div className="shop-cart-title">
            <span>🛒</span>
            <strong>ตะกร้าสินค้า</strong>
            <span className="shop-cart-badge">{totalQty}</span>
          </div>

          <div className="shop-cart-subtitle">รายการสินค้าที่เลือก</div>
        </div>

        {!isEmpty ? (
          <button type="button" className="shop-clear-btn" onClick={onClear}>
            ล้างตะกร้า
          </button>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="shop-cart-empty">
          <div className="shop-cart-empty-icon">🛒</div>
          <div className="shop-cart-empty-title">ยังไม่มีสินค้าในตะกร้า</div>
          <div className="shop-cart-empty-text">
            เลือกสินค้าที่ต้องการด้านซ้าย
          </div>
        </div>
      ) : (
        <>
          <div className="shop-cart-items">
            {items.map((item) => (
              <div key={item.productId} className="shop-cart-item">
                <div className="shop-cart-item-main">
                  <div className="shop-cart-item-name">
                    {item.productName}
                  </div>

                  <div className="shop-cart-item-price">
                    ฿{item.unitPrice.toLocaleString("th-TH")}
                  </div>
                </div>

                <div className="shop-cart-actions">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onDecrease(item.productId)}
                  >
                    −
                  </button>

                  <span className="qty-value">{item.quantity}</span>

                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onIncrease(item.productId)}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => onRemove(item.productId)}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="shop-cart-summary">
            <div className="summary-row">
              <span>รวมสินค้า</span>
              <strong>{totalQty} ชิ้น</strong>
            </div>

            <div className="summary-row total">
              <span>ยอดรวม</span>
              <strong>฿{totalAmount.toLocaleString("th-TH")}</strong>
            </div>
          </div>

          <button
            type="button"
            className="shop-checkout-btn"
            onClick={onCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </aside>
  );
}