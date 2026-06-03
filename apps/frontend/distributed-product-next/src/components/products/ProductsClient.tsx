// src/components/products/ProductsClient.tsx
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import {
  CategoryOption,
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from "@/types/product.type";

export default function ProductsClient() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const isActive =
          statusFilter === "all" ? undefined : statusFilter === "active";

        const [productResult, categoryResult] = await Promise.all([
          productService.getProducts({
            search,
            categoryId:
              categoryFilter === "all" ? undefined : categoryFilter,
            isActive,
          }),
          categoryService.getAll(undefined, true),
        ]);

        if (ignore) return;

        setProducts(productResult);

        setCategories(
          categoryResult.map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } catch (err) {
        if (ignore) return;

        setError(
          err instanceof Error ? err.message : "Load products failed."
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    const timer = window.setTimeout(() => {
      void fetchData();
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [refreshKey, search, categoryFilter, statusFilter]);

  function handleAddClick() {
    setEditingProduct(null);
    setShowProductModal(true);
  }

  function handleEditProduct(product: ProductResponse) {
    setEditingProduct(product);
    setShowProductModal(true);
  }

  function handleCloseModal() {
    setShowProductModal(false);
    setEditingProduct(null);
  }

  async function handleSubmitProduct(
    data: CreateProductRequest | UpdateProductRequest
  ) {
    try {
      if (editingProduct) {
        await productService.updateProduct(
          editingProduct.id,
          data as UpdateProductRequest
        );

        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Product updated successfully.",
          confirmButtonText: "OK",
        });
      } else {
        await productService.createProduct(data as CreateProductRequest);

        await Swal.fire({
          icon: "success",
          title: "Created",
          text: "Product created successfully.",
          confirmButtonText: "OK",
        });
      }

      handleCloseModal();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: editingProduct
          ? "Update product failed"
          : "Create product failed",
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
        confirmButtonText: "OK",
      });
    }
  }

  async function handleDeleteProduct(id: string) {
    const result = await Swal.fire({
      icon: "warning",
      title: "ต้องการลบสินค้านี้ใช่ไหม?",
      text: "เมื่อลบแล้วจะไม่สามารถย้อนกลับได้",
      showCancelButton: true,
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await productService.deleteProduct(id);

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Product deleted successfully.",
        confirmButtonText: "OK",
      });

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Delete product failed",
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <main className="content">
      <div className="page-header">
        <h1 className="page-title">Products</h1>

        <div className="page-breadcrumb">
          <a href="/dashboard">Home</a>
          <span>/</span>
          <a href="#">Catalog</a>
          <span>/</span>
          Products
        </div>
      </div>

      <ProductToolbar
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onAddClick={handleAddClick}
      />

      {loading && (
        <div className="card empty-state">
          Loading products...
        </div>
      )}

      {error && (
        <div className="card error-state">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ProductTable
          products={products}
          total={products.length}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

   <ProductModal
  key={editingProduct ? `edit-${editingProduct.id}` : "add-product"}
  show={showProductModal}
  categories={categories}
  product={editingProduct}
  onClose={handleCloseModal}
  onSubmit={handleSubmitProduct}
/>
    </main>
  );
}