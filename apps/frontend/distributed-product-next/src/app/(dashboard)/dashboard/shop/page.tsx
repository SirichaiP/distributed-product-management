"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CartPanel from "@/components/shop/CartPanel";
import CheckoutModal from "@/components/shop/CheckoutModal";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";

import { categoryService } from "@/services/category.service";
import { orderService } from "@/services/order.service";
import { shopService } from "@/services/shop.service";
import {
  CartItem,
  CartMap,
  ShopCategory,
  ShopCategoryOption,
  ShopProduct,
} from "@/types/shop.type";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  const [searchText, setSearchText] = useState("");
  const [currentCategory, setCurrentCategory] =
    useState<ShopCategory>("all");

  const [categoryOptions, setCategoryOptions] = useState<
    ShopCategoryOption[]
  >([
    {
      label: "ทั้งหมด",
      value: "all",
    },
  ]);

  const [cart, setCart] = useState<CartMap>({});
  const [toastMessage, setToastMessage] = useState("");

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories({
        isActive: true,
      });

      const options: ShopCategoryOption[] = [
        {
          label: "ทั้งหมด",
          value: "all",
        },
        ...data.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      ];

      setCategoryOptions(options);
    } catch (err) {
      console.error(err);

      setCategoryOptions([
        {
          label: "ทั้งหมด",
          value: "all",
        },
      ]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await shopService.getProducts({
        search: searchText,
        categoryId:
          currentCategory === "all" ? undefined : currentCategory,
        isActive: true,
      });

      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("โหลดรายการสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [searchText, currentCategory]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchCategories]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchProducts();
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchProducts]);

  const cartItems = useMemo<CartItem[]>(() => {
    return Object.values(cart);
  }, [cart]);

  const totalQty = useMemo<number>(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo<number>(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }, [cartItems]);

  function getProductAvailableQuantity(product: ShopProduct) {
    return product.availableQuantity ?? product.stockQuantity;
  }

  function showToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2800);
  }

  async function recheckCartStockBeforeCheckout() {
    const latestProducts = await shopService.getProducts({
      search: searchText,
      categoryId:
        currentCategory === "all" ? undefined : currentCategory,
      isActive: true,
    });

    const latestProductMap = new Map(
      latestProducts.map((product) => [product.id, product])
    );

    for (const cartItem of cartItems) {
      const latestProduct = latestProductMap.get(cartItem.productId);

      if (!latestProduct) {
        return {
          valid: false,
          message: `ไม่พบสินค้า "${cartItem.productName}" ในระบบ`,
          products: latestProducts,
        };
      }

      const availableQuantity =
        latestProduct.availableQuantity ?? latestProduct.stockQuantity;

      if (availableQuantity <= 0) {
        return {
          valid: false,
          message: `สินค้า "${cartItem.productName}" หมดแล้ว`,
          products: latestProducts,
        };
      }

      if (cartItem.quantity > availableQuantity) {
        return {
          valid: false,
          message: `สินค้า "${cartItem.productName}" เหลือพร้อมขาย ${availableQuantity.toLocaleString(
            "th-TH"
          )} ชิ้น แต่คุณเลือก ${cartItem.quantity.toLocaleString(
            "th-TH"
          )} ชิ้น`,
          products: latestProducts,
        };
      }
    }

    return {
      valid: true,
      message: "",
      products: latestProducts,
    };
  }

  function addToCart(productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    const availableQuantity = getProductAvailableQuantity(product);

    if (availableQuantity <= 0) {
      showToast("⚠ สินค้าพร้อมขายหมด");
      return;
    }

    setCart((prev) => {
      const currentItem = prev[productId];

      if (currentItem && currentItem.quantity >= availableQuantity) {
        showToast("⚠ ไม่สามารถเพิ่มได้ สินค้าพร้อมขายไม่พอ");
        return prev;
      }

      if (currentItem) {
        return {
          ...prev,
          [productId]: {
            ...currentItem,
            quantity: currentItem.quantity + 1,
            stockQuantity: availableQuantity,
          },
        };
      }

      return {
        ...prev,
        [productId]: {
          productId: product.id,
          productName: product.name,
          categoryName: product.categoryName,
          unitPrice: product.price,
          quantity: 1,
          stockQuantity: availableQuantity,
          imageUrl: "https://source.unsplash.com/random/400x400?sig=" + product.id,
        },
      };
    });

    showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`);
  }

  function increaseQty(productId: string) {
    const latestProduct = products.find((item) => item.id === productId);

    const availableQuantity = latestProduct
      ? getProductAvailableQuantity(latestProduct)
      : 0;

    setCart((prev) => {
      const currentItem = prev[productId];

      if (!currentItem) return prev;

      if (availableQuantity <= 0) {
        showToast("⚠ สินค้าพร้อมขายหมด");
        return prev;
      }

      if (currentItem.quantity >= availableQuantity) {
        showToast("⚠ ไม่สามารถเพิ่มได้ สินค้าพร้อมขายไม่พอ");
        return prev;
      }

      return {
        ...prev,
        [productId]: {
          ...currentItem,
          quantity: currentItem.quantity + 1,
          stockQuantity: availableQuantity,
        },
      };
    });
  }

  function decreaseQty(productId: string) {
    setCart((prev) => {
      const currentItem = prev[productId];

      if (!currentItem) return prev;

      if (currentItem.quantity <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }

      return {
        ...prev,
        [productId]: {
          ...currentItem,
          quantity: currentItem.quantity - 1,
        },
      };
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  function openCheckoutModal() {
    if (cartItems.length === 0) {
      showToast("กรุณาเลือกสินค้าก่อน Checkout");
      return;
    }

    setCheckoutSuccess(false);
    setOrderId("");
    setCheckoutOpen(true);
  }

  function closeCheckoutModal() {
    if (checkoutLoading) return;

    setCheckoutOpen(false);
    setCheckoutSuccess(false);
  }

  async function placeOrder() {
    if (cartItems.length === 0) {
      showToast("กรุณาเลือกสินค้าก่อน Checkout");
      return;
    }

    try {
      setCheckoutLoading(true);

      // 1. Re-check stock ล่าสุดจาก Backend ก่อน Checkout จริง
      const stockCheckResult = await recheckCartStockBeforeCheckout();

      // 2. อัปเดตสินค้าในหน้า Shop จากข้อมูลล่าสุด
      setProducts(stockCheckResult.products);

      // 3. ถ้าสินค้าไม่พอ หยุด ไม่สร้าง Order
      if (!stockCheckResult.valid) {
        showToast(`⚠ ${stockCheckResult.message}`);
        return;
      }

      // 4. ถ้าสินค้าพอ ค่อยสร้าง Order
      const payload = {
        userId: DEMO_USER_ID,
        currency: "THB",
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      };

      console.log("Place order payload:", payload);

      const order = await orderService.placeOrder(payload);

      setOrderId(order.id);
      setCheckoutSuccess(true);
      setCart({});

      // 5. หลัง Checkout สำเร็จ ให้ get products ใหม่อีกครั้ง
      await fetchProducts();

      showToast("✅ สั่งซื้อสำเร็จ อัปเดตสินค้าล่าสุดแล้ว");
    } catch (err) {
      console.error(err);

      // ถ้า Backend reject เพราะ Stock ไม่พอ ให้โหลดสินค้าใหม่ด้วย
      await fetchProducts();

      showToast("⚠ สั่งซื้อไม่สำเร็จ กรุณาตรวจสอบสินค้าอีกครั้ง");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="shop-page">
      <div
        className={
          checkoutOpen ? "shop-content is-blurred" : "shop-content"
        }
      >
        <div className="page-header">
          <div>
            <h1 className="page-title">เลือกซื้อสินค้า</h1>

            <div className="page-breadcrumb">
              <Link href="/dashboard">Home</Link>
              <span>/</span>
              ร้านค้า
            </div>
          </div>
        </div>

        <ShopFilters
          searchText={searchText}
          currentCategory={currentCategory}
          categories={categoryOptions}
          onSearchChange={setSearchText}
          onCategoryChange={setCurrentCategory}
        />

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">กำลังโหลดสินค้า...</div>
            <div className="empty-state-text">
              ระบบกำลังดึงข้อมูลสินค้าจาก API
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠</div>
            <div className="empty-state-title">เกิดข้อผิดพลาด</div>
            <div className="empty-state-text">{error}</div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => void fetchProducts()}
            >
              โหลดใหม่
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="shop-layout">
            <div>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cart={cart}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-title">ไม่พบสินค้า</div>
                  <div className="empty-state-text">
                    ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ใหม่
                  </div>
                </div>
              ) : null}
            </div>

            <CartPanel
              items={cartItems}
              totalQty={totalQty}
              totalAmount={totalAmount}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
              onRemove={removeFromCart}
              onClear={clearCart}
              onCheckout={openCheckoutModal}
            />
          </div>
        ) : null}

        {toastMessage ? (
          <div className="toast show">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        ) : null}
      </div>

      <CheckoutModal
        open={checkoutOpen}
        success={checkoutSuccess}
        loading={checkoutLoading}
        orderId={orderId}
        items={cartItems}
        totalAmount={totalAmount}
        onClose={closeCheckoutModal}
        onConfirm={placeOrder}
      />
    </div>
  );
}