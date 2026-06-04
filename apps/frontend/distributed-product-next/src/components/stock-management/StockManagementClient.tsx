"use client";

// src/components/stock-management/StockManagementClient.tsx

import { useCallback, useEffect, useMemo, useState } from "react";

import AdjustStockModal from "./AdjustStockModal";
import ReserveStockModal from "./ReserveStockModal";
import StockSummaryCards from "./StockSummaryCards";
import StockTable from "./StockTable";
import StockToolbar from "./StockToolbar";

import { stockService } from "@/services/stock.service";
import type { StockProduct } from "@/types/stock.type";

export default function StockManagementClient() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [adjustProduct, setAdjustProduct] = useState<StockProduct | null>(null);
  const [reserveProduct, setReserveProduct] = useState<StockProduct | null>(
    null
  );

  const loadProducts = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await stockService.getProducts();
      setProducts(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "ไม่สามารถโหลดข้อมูล Stock จาก API ได้";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) {
        void loadProducts();
      }
    });

    return () => {
      active = false;
    };
  }, [loadProducts]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category))
      )
    );
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

  async function handleAdjustSuccess() {
    setAdjustProduct(null);
    await loadProducts({ silent: true });
  }

  async function handleReserveSuccess() {
    setReserveProduct(null);
    await loadProducts({ silent: true });
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

        <button
          type="button"
          className="stock-refresh-btn"
          onClick={() => void loadProducts({ silent: true })}
          disabled={loading || refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
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
            <button type="button" className="stock-page-btn" disabled>
              ‹
            </button>

            <button type="button" className="stock-page-btn active">
              1
            </button>

            <button type="button" className="stock-page-btn" disabled>
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