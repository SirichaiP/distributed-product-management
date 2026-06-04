// src/components/products/ProductModal.tsx
"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

type ProductFormState = CreateProductRequest & {
  isActive: boolean;
};

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
): ProductFormState {
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
      isActive: true,
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
    isActive: product.isActive !== false,
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

  const [form, setForm] = useState<ProductFormState>(() =>
    createFormFromProduct(product)
  );

  const autoSlug = useMemo(() => createSlug(form.name), [form.name]);

  useEffect(() => {
    if (!show) return;

    queueMicrotask(() => {
      setForm(createFormFromProduct(product));
      setSubmitting(false);
    });
  }, [show, product]);

  if (!show) return null;

  function updateForm<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleClose() {
    if (submitting) return;
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

      if (isEditMode) {
        const updatePayload: UpdateProductRequest = {
          categoryId: form.categoryId,
          name: form.name.trim(),
          slug: form.slug.trim() || autoSlug,
          description: form.description?.trim() || undefined,
          price: Number(form.price),
          currency: form.currency || "THB",
          stockQuantity: Number(form.stockQuantity),
          sku: form.sku.trim(),
          isActive: form.isActive,
        };

        await onSubmit(updatePayload);
        return;
      }

      const createPayload: CreateProductRequest = {
        categoryId: form.categoryId,
        name: form.name.trim(),
        imageUrl: form.imageUrl?.trim() || DEFAULT_PRODUCT_IMAGE,
        slug: form.slug.trim() || autoSlug,
        description: form.description?.trim() || undefined,
        price: Number(form.price),
        currency: form.currency || "THB",
        stockQuantity: Number(form.stockQuantity),
        sku: form.sku.trim(),
      };

      await onSubmit(createPayload);
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
            disabled={submitting}
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
                disabled={submitting}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>

            {!isEditMode && (
              <div className="form-group full">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={DEFAULT_PRODUCT_IMAGE}
                  value={form.imageUrl}
                  disabled={submitting}
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
            )}

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.categoryId}
                disabled={submitting}
                onChange={(e) => updateForm("categoryId", e.target.value)}
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
                disabled={submitting}
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
                disabled={submitting}
                onChange={(e) =>
                  updateForm("price", Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isEditMode ? "Stock Quantity" : "Initial Stock"}
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={
                  form.stockQuantity === 0 ? "" : form.stockQuantity
                }
                disabled={submitting}
                onChange={(e) =>
                  updateForm(
                    "stockQuantity",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            {isEditMode && (
              <div className="form-group full">
                <label className="form-label">Status</label>

                <select
                  className="form-select"
                  value={form.isActive ? "active" : "inactive"}
                  disabled={submitting}
                  onChange={(e) =>
                    updateForm("isActive", e.target.value === "active")
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter product description..."
                value={form.description}
                disabled={submitting}
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
            disabled={submitting}
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