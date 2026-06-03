"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CategoryStats from "@/components/categories/CategoryStats";
import CategoryToolbar from "@/components/categories/CategoryToolbar";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryFormModal from "@/components/categories/CategoryFormModal";

import { categoryService } from "@/services/category.service";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.type";
import { canWrite } from "@/lib/permissions";
import { useAuth } from "@/context/AuthContext";

function getSelectedCategory(
  categories: Category[],
  current: Category | null
): Category | null {
  if (categories.length === 0) {
    return null;
  }

  if (!current) {
    return categories[0];
  }

  return categories.find((item) => item.id === current.id) ?? categories[0];
}

export default function CategoriesPage() {
  const { user } = useAuth();

  const role = user?.role ?? "User";
  const allowWrite = canWrite(role);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialCategories() {
      try {
        const data = await categoryService.getAll();

        if (cancelled) {
          return;
        }

        setCategories(data);
        setSelectedCategory(data[0] ?? null);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          alert("โหลดข้อมูล Categories ไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    }

    void loadInitialCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadCategories() {
    try {
      const data = await categoryService.getAll();

      setCategories(data);
      setSelectedCategory((current) => getSelectedCategory(data, current));
    } catch (error) {
      console.error(error);
      alert("โหลดข้อมูล Categories ไม่สำเร็จ");
    }
  }

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return categories.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword) ||
        (item.description ?? "").toLowerCase().includes(keyword);

      const matchStatus =
        status === "all" ||
        (status === "active" && item.isActive) ||
        (status === "inactive" && !item.isActive);

      return matchKeyword && matchStatus;
    });
  }, [categories, search, status]);

  function handleAddClick() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function handleEditClick(category: Category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleDelete(category: Category) {
    if (!allowWrite) {
      return;
    }

    const ok = confirm(`ต้องการลบ Category "${category.name}" ใช่ไหม?`);

    if (!ok) {
      return;
    }

    try {
      await categoryService.delete(category.id);
      await reloadCategories();
    } catch (error) {
      console.error(error);
      alert("ลบ Category ไม่สำเร็จ");
    }
  }

  async function handleSubmit(
    payload: CreateCategoryRequest | UpdateCategoryRequest
  ) {
    if (!allowWrite) {
      return;
    }

    try {
      setSaveLoading(true);

      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
      } else {
        await categoryService.create(payload);
      }

      setModalOpen(false);
      setEditingCategory(null);

      await reloadCategories();
    } catch (error) {
      console.error(error);
      alert("บันทึก Category ไม่สำเร็จ");
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <>
      <main className="content categories-page">
        <div className="page-header">
          <h1 className="page-title">Categories</h1>

          <div className="page-breadcrumb">
            <Link href="/dashboard">Home</Link>
            <span>/</span>
            Categories
          </div>
        </div>

        {pageLoading ? (
          <div className="card" style={{ padding: 28 }}>
            Loading categories...
          </div>
        ) : (
          <>
            <CategoryStats categories={categories} />

            <CategoryToolbar
              search={search}
              status={status}
              canWrite={allowWrite}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onAddClick={handleAddClick}
            />

            <CategoryTable
              categories={filteredCategories}
              selectedId={selectedCategory?.id}
              canWrite={allowWrite}
              onSelect={setSelectedCategory}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      <CategoryFormModal
        open={modalOpen}
        category={editingCategory}
        loading={saveLoading}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}