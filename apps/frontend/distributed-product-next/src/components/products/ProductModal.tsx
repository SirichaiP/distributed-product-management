// src/components/products/ProductModal.tsx
"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import {
  CategoryOption,
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from "@/types/product.type";

interface ProductModalProps {
  show: boolean;
  categories: CategoryOption[];
  product?: ProductResponse | null;
  onClose: () => void;
  onSubmit: (
    data: CreateProductRequest | UpdateProductRequest
  ) => Promise<void>;
}

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/600x400?text=Product";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createFormFromProduct(
  product?: ProductResponse | null
): CreateProductRequest {
  if (!product) {
    return {
      categoryId: "",
      name: "",
      imageUrl: DEFAULT_PRODUCT_IMAGE,
      slug: "",
      description: "",
      price: 0,
      currency: "THB",
      stockQuantity: 0,
      sku: "",
    };
  }

  return {
    categoryId: product.categoryId ?? "",
    name: product.name ?? "",
    imageUrl: product.imageUrl || DEFAULT_PRODUCT_IMAGE,
    slug: product.slug ?? "",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    currency: product.currency || "THB",
    stockQuantity: Number(product.stockQuantity ?? 0),
    sku: product.sku ?? "",
  };
}

export default function ProductModal({
  show,
  categories,
  product,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const isEditMode = Boolean(product);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateProductRequest>(() =>
    createFormFromProduct(product)
  );

  const autoSlug = useMemo(() => createSlug(form.name), [form.name]);

  if (!show) return null;

  function updateForm<K extends keyof CreateProductRequest>(
    key: K,
    value: CreateProductRequest[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleClose() {
    onClose();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (!form.categoryId) {
      alert("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (!form.sku.trim()) {
      alert("กรุณากรอก SKU");
      return;
    }

    if (Number(form.price) <= 0) {
      alert("กรุณากรอกราคาสินค้า");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        categoryId: form.categoryId,
        name: form.name.trim(),
        imageUrl: form.imageUrl?.trim() || DEFAULT_PRODUCT_IMAGE,
        slug: form.slug.trim() || autoSlug,
        description: form.description?.trim(),
        price: Number(form.price),
        currency: form.currency || "THB",
        stockQuantity: Number(form.stockQuantity),
        sku: form.sku.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="product-modal-overlay">
      <form className="product-modal" onSubmit={handleSubmit}>
        <div className="product-modal-header">
          <span className="product-modal-title">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </span>

          <button
            type="button"
            className="product-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="product-modal-body">
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder={DEFAULT_PRODUCT_IMAGE}
                value={form.imageUrl}
                onChange={(e) => updateForm("imageUrl", e.target.value)}
              />

              {form.imageUrl?.trim() && (
                <div className="product-url-preview">
                  <Image
                    src={form.imageUrl}
                    alt="Product preview"
                    width={120}
                    height={80}
                    className="product-image-preview"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.categoryId}
                onChange={(e) =>
                  updateForm("categoryId", e.target.value)
                }
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ELEC-HP-001"
                value={form.sku}
                onChange={(e) => updateForm("sku", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (฿)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price === 0 ? "" : form.price}
                onChange={(e) =>
                  updateForm("price", Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={
                  form.stockQuantity === 0 ? "" : form.stockQuantity
                }
                onChange={(e) =>
                  updateForm(
                    "stockQuantity",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter product description..."
                value={form.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="product-modal-footer">
          <button
            type="button"
            className="btn-secondary product-cancel-button"
            onClick={handleClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary product-save-button"
            disabled={submitting}
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Product"
                : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}