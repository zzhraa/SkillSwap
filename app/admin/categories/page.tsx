"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, FolderKanban, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CategoryStatus = "active" | "inactive";

interface Category {
  id: string;
  name: string;
  iconEmoji: string;
  description: string;
  totalSkills: number;
  status: CategoryStatus;
}

const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Teknologi",
    iconEmoji: "💻",
    description: "Pemrograman, web dev, mobile, dan IT",
    totalSkills: 48,
    status: "active",
  },
  {
    id: "cat-2",
    name: "Desain",
    iconEmoji: "🎨",
    description: "Grafis, UI/UX, ilustrasi, dan multimedia",
    totalSkills: 31,
    status: "active",
  },
  {
    id: "cat-3",
    name: "Bahasa",
    iconEmoji: "🌍",
    description: "Bahasa asing dan komunikasi",
    totalSkills: 22,
    status: "active",
  },
  {
    id: "cat-4",
    name: "Bisnis",
    iconEmoji: "📊",
    description: "Kewirausahaan, pemasaran, dan manajemen",
    totalSkills: 17,
    status: "active",
  },
  {
    id: "cat-5",
    name: "Seni & Musik",
    iconEmoji: "🎵",
    description: "Musik, fotografi, dan seni rupa",
    totalSkills: 14,
    status: "inactive",
  },
  {
    id: "cat-6",
    name: "Akademik",
    iconEmoji: "📚",
    description: "Matematika, sains, dan ilmu sosial",
    totalSkills: 9,
    status: "active",
  },
  {
    id: "cat-7",
    name: "Kesehatan & Sport",
    iconEmoji: "⚽",
    description: "Olahraga, kesehatan, dan kebugaran",
    totalSkills: 6,
    status: "inactive",
  },
];

function statusBadgeVariant(status: CategoryStatus) {
  return status === "active" ? ("success" as const) : ("destructive" as const);
}

function statusLabel(status: CategoryStatus) {
  return status === "active" ? "Active" : "Inactive";
}

export default function AdminCategoriesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const { categories: rawCats } = await res.json();
          setCategories(
            (rawCats || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              iconEmoji: c.icon || "📁",
              description: c.description || "",
              totalSkills: 0, // Fallback mock
              status: "active",
            }))
          );
        }
      } catch {
        // ignore
      }
    }
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  function handleAddCategory() {
    alert("Menambah kategori melalui UI ini akan diimplementasi nanti via Admin API.");
  }

  function handleEditCategory(category: Category) {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">
                  Category Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola kategori skill yang tersedia di seluruh platform
                </p>
              </div>
              <Button type="button" onClick={handleAddCategory} className="shrink-0">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari kategori..."
                className="pl-9 pr-8"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                  className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Card className="shadow-card">
              {filteredCategories.length === 0 ? (
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <FolderKanban className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tidak ada kategori ditemukan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coba gunakan kata kunci pencarian yang berbeda
                    </p>
                  </div>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Description
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Total Skills
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-border last:border-0 hover:bg-accent/40"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">
                                {category.iconEmoji}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="max-w-xs truncate text-sm text-foreground/80">
                              {category.description}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-foreground">
                              {category.totalSkills}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant={statusBadgeVariant(category.status)}>
                              {statusLabel(category.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setDeleteTarget(category)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-dropdown"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2
                id="delete-category-title"
                className="text-md font-semibold text-foreground"
              >
                Hapus Kategori
              </h2>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                aria-label="Tutup"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-foreground/80">
                Yakin ingin menghapus kategori{" "}
                <span className="font-semibold">{deleteTarget.name}</span>?
                Tindakan ini hanya simulasi di frontend dan tidak dapat
                dibatalkan pada data ini.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border p-5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}