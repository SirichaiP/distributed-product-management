import { CartMap, ShopProduct } from "@/types/shop.type";

interface ProductCardProps {
  product: ShopProduct;
  cart: CartMap;
  onAddToCart: (productId: string) => void;
}

function getProductIcon(categoryName?: string | null) {
  const value = categoryName?.toLowerCase() ?? "";

  if (value.includes("electronic") || value.includes("อิเล็ก")) return "📱";
  if (value.includes("accessories") || value.includes("เสริม")) return "🔌";
  if (value.includes("audio") || value.includes("เสียง")) return "🎧";
  if (value.includes("computer") || value.includes("คอม")) return "💻";

  return "📦";
}

export default function ProductCard({
  product,
  cart,
  onAddToCart,
}: ProductCardProps) {
  const cartItem = cart[product.id];
  const selectedQty = cartItem?.quantity ?? 0;

  const isOutOfStock = product.stockQuantity <= 0;
  const isMaxSelected = selectedQty >= product.stockQuantity;

  return (
    <div className="shop-product-card">
      <div className="shop-product-image">
        <span>{getProductIcon(product.categoryName)}</span>

        {selectedQty > 0 ? (
          <div className="shop-product-selected">{selectedQty}</div>
        ) : null}
      </div>

      <div className="shop-product-body">
        <div className="shop-product-category">
          {product.categoryName ?? "ไม่ระบุหมวดหมู่"}
        </div>

        <div className="shop-product-name">{product.name}</div>

        <div
          className={
            product.stockQuantity <= 5
              ? "shop-product-stock warning"
              : "shop-product-stock"
          }
        >
          {isOutOfStock
            ? "สินค้าหมด"
            : `มีสินค้า ${product.stockQuantity.toLocaleString("th-TH")} ชิ้น`}
        </div>
      </div>

      <div className="shop-product-footer">
        <div className="shop-product-price">
          ฿{product.price.toLocaleString("th-TH")}
        </div>

        <button
          type="button"
          className="shop-add-btn"
          disabled={isOutOfStock || isMaxSelected}
          onClick={() => onAddToCart(product.id)}
        >
          +
        </button>
      </div>
    </div>
  );
}