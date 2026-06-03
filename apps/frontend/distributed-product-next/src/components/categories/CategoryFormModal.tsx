"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.type";

interface CategoryFormModalProps {
  open: boolean;
  category?: Category | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryRequest | UpdateCategoryRequest) => void;
}

interface CategoryFormContentProps {
  category?: Category | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryRequest | UpdateCategoryRequest) => void;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryFormContent({
  category,
  loading,
  onClose,
  onSubmit,
}: CategoryFormContentProps) {
  const isEdit = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(
    category?.description ?? ""
  );
  const [isActive, setIsActive] = useState(
    category?.isActive ?? true
  );

  function handleNameChange(value: string) {
    setName(value);

    if (!isEdit) {
      setSlug(createSlug(value));
    }
  }

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      alert("กรุณากรอกชื่อ Category");
      return;
    }

    if (!trimmedSlug) {
      alert("กรุณากรอก Slug");
      return;
    }

    onSubmit({
      name: trimmedName,
      slug: trimmedSlug,
      description: description.trim(),
      isActive,
    });
  }

  return (
    <div
      className="category-modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="category-modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="category-modal-header">
          <span className="category-modal-title">
            {isEdit ? "Edit Category" : "Add New Category"}
          </span>

          <button
            type="button"
            className="category-modal-close"
            onClick={onClose}
            disabled={loading}
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

        <div className="category-modal-body">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter category name"
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              className="form-input"
              placeholder="auto-generated-from-name"
              value={slug}
              onChange={(event) =>
                setSlug(createSlug(event.target.value))
              }
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter category description..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={isActive ? "active" : "inactive"}
              onChange={(event) =>
                setIsActive(event.target.value === "active")
              }
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="category-modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryFormModal({
  open,
  category,
  loading = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loading, onClose]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <CategoryFormContent
      key={category?.id ?? "new-category"}
      category={category}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />,
    document.body
  );
}