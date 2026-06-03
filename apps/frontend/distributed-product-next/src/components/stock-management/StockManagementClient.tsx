"use client";

// src/components/stock-management/StockManagementClient.tsx

import { useEffect, useMemo, useState } from "react";

import AdjustStockModal from "./AdjustStockModal";
import ReserveStockModal from "./ReserveStockModal";
import StockSummaryCards from "./StockSummaryCards";
import StockTable from "./StockTable";
import StockToolbar from "./StockToolbar";

import { mockStockProducts } from "@/lib/mock/stock.mock";
import { stockService } from "@/services/stock.service";
import type { StockProduct } from "@/types/stock.type";

export default function StockManagementClient() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [adjustProduct, setAdjustProduct] = useState<StockProduct | null>(null);
  const [reserveProduct, setReserveProduct] = useState<StockProduct | null>(
    null
  );

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        if (!ignore) {
          setLoading(true);
          setError(null);
        }

        const data = await stockService.getProducts();

        if (!ignore) {
          setProducts(data);
        }
      } catch {
        if (!ignore) {
          setProducts(mockStockProducts);
          setError("ไม่สามารถโหลดข้อมูลจาก API ได้ ระบบจะแสดงข้อมูลตัวอย่างแทน");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const stockStatus =
        product.stock === 0 ? "low" : product.stock < 10 ? "warn" : "ok";

      const matchSearch =
        keyword.length === 0 ||
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword);

      const matchStock =
        stockFilter === "all" || stockFilter === stockStatus;

      const matchCategory =
        categoryFilter === "all" || categoryFilter === product.category;

      return matchSearch && matchStock && matchCategory;
    });
  }, [products, search, stockFilter, categoryFilter]);

  const summary = useMemo(() => {
    return {
      totalProducts: products.length,
      unitsInStock: products.reduce(
        (total, product) => total + product.stock,
        0
      ),
      lowStock: products.filter(
        (product) => product.stock > 0 && product.stock < 10
      ).length,
      outOfStock: products.filter((product) => product.stock === 0).length,
    };
  }, [products]);

  async function refreshProducts() {
    try {
      const data = await stockService.getProducts();
      setProducts(data);
      setError(null);
    } catch {
      setProducts((currentProducts) => currentProducts);
      setError("อัปเดตข้อมูลจาก API ไม่สำเร็จ แต่ระบบยังแสดงข้อมูลล่าสุดไว้ให้");
    }
  }

  function updateProductStock(productId: string, newStock: number) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: newStock,
            }
          : product
      )
    );
  }

  function handleAdjustSuccess(productId: string, newStock: number) {
    updateProductStock(productId, newStock);
    setAdjustProduct(null);
    refreshProducts();
  }

  function handleReserveSuccess(productId: string, newStock: number) {
    updateProductStock(productId, newStock);
    setReserveProduct(null);
    refreshProducts();
  }

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Management</h1>

          <p className="page-breadcrumb">
            <a href="/dashboard">Catalog</a>
            <span>/</span>
            Stock Management
          </p>
        </div>
      </div>

      {error && <div className="stock-alert-warning">{error}</div>}

      <StockSummaryCards summary={summary} />

      <div className="stock-card">
        <div className="stock-card-header">
          <span className="stock-card-title">Product stock overview</span>

          <span className="stock-result-count">
            {filteredProducts.length} products
          </span>
        </div>

        <StockToolbar
          search={search}
          stockFilter={stockFilter}
          categoryFilter={categoryFilter}
          categories={categories}
          onSearchChange={setSearch}
          onStockFilterChange={setStockFilter}
          onCategoryFilterChange={setCategoryFilter}
        />

        <StockTable
          products={filteredProducts}
          loading={loading}
          onAdjust={setAdjustProduct}
          onReserve={setReserveProduct}
        />

        <div className="stock-pagination">
          <span className="stock-pagination-info">
            Showing {filteredProducts.length === 0 ? 0 : 1} to{" "}
            {filteredProducts.length} of {products.length} entries
          </span>

          <div className="stock-pagination-btns">
            <button type="button" className="stock-page-btn">
              ‹
            </button>

            <button type="button" className="stock-page-btn active">
              1
            </button>

            <button type="button" className="stock-page-btn">
              ›
            </button>
          </div>
        </div>
      </div>

      <AdjustStockModal
        product={adjustProduct}
        onClose={() => setAdjustProduct(null)}
        onSuccess={handleAdjustSuccess}
      />

      <ReserveStockModal
        product={reserveProduct}
        onClose={() => setReserveProduct(null)}
        onSuccess={handleReserveSuccess}
      />
    </main>
  );
}