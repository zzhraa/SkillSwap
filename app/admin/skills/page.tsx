"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, ShieldAlert, Sparkles, Trash2, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SkillLevel = "beginner" | "intermediate" | "advanced";
type SkillStatus = "active" | "inactive";

interface AdminSkill {
  id: string;
  name: string;
  category: string;
  mentorName: string;
  level: SkillLevel;
  status: SkillStatus;
}

const initialSkills: AdminSkill[] = [
  {
    id: "skill-1",
    name: "React.js",
    category: "Teknologi",
    mentorName: "Dimas Pratama",
    level: "advanced",
    status: "active",
  },
  {
    id: "skill-2",
    name: "UI/UX Design",
    category: "Desain",
    mentorName: "Rina Kusuma",
    level: "intermediate",
    status: "active",
  },
  {
    id: "skill-3",
    name: "Conversational English",
    category: "Bahasa",
    mentorName: "Sari Dewi",
    level: "advanced",
    status: "active",
  },
  {
    id: "skill-4",
    name: "Public Speaking",
    category: "Bisnis",
    mentorName: "Bayu Aditya",
    level: "beginner",
    status: "inactive",
  },
  {
    id: "skill-5",
    name: "Gitar Akustik",
    category: "Seni & Musik",
    mentorName: "Putri Amalia",
    level: "intermediate",
    status: "active",
  },
  {
    id: "skill-6",
    name: "Kalkulus Dasar",
    category: "Akademik",
    mentorName: "Fajar Nugroho",
    level: "advanced",
    status: "active",
  },
  {
    id: "skill-7",
    name: "Next.js",
    category: "Teknologi",
    mentorName: "Dimas Pratama",
    level: "intermediate",
    status: "active",
  },
  {
    id: "skill-8",
    name: "Fotografi Produk",
    category: "Seni & Musik",
    mentorName: "Citra Ramadhani",
    level: "beginner",
    status: "inactive",
  },
  {
    id: "skill-9",
    name: "Bahasa Jepang",
    category: "Bahasa",
    mentorName: "Yusuf Hakim",
    level: "beginner",
    status: "active",
  },
  {
    id: "skill-10",
    name: "Manajemen Proyek",
    category: "Bisnis",
    mentorName: "Melati Anggraini",
    level: "intermediate",
    status: "active",
  },
  {
    id: "skill-11",
    name: "Yoga & Mindfulness",
    category: "Kesehatan & Sport",
    mentorName: "Putri Amalia",
    level: "beginner",
    status: "inactive",
  },
];

function levelBadgeVariant(level: SkillLevel) {
  if (level === "beginner") return "success" as const;
  if (level === "intermediate") return "warning" as const;
  return "default" as const;
}

function levelLabel(level: SkillLevel) {
  if (level === "beginner") return "Beginner";
  if (level === "intermediate") return "Intermediate";
  return "Advanced";
}

function statusBadgeVariant(status: SkillStatus) {
  return status === "active" ? ("success" as const) : ("warning" as const);
}

function statusLabel(status: SkillStatus) {
  return status === "active" ? "Active" : "Inactive";
}

interface ViewSkillModalProps {
  skill: AdminSkill | null;
  onClose: () => void;
}

function ViewSkillModal({ skill, onClose }: ViewSkillModalProps) {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-skill-title"
        className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2
            id="view-skill-title"
            className="text-md font-semibold text-foreground"
          >
            Detail Skill
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-md font-semibold text-foreground">
                {skill.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {skill.category}
              </p>
            </div>
          </div>

          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Mentor</dt>
              <dd className="text-sm font-medium text-foreground">
                {skill.mentorName}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Level</dt>
              <dd>
                <Badge variant={levelBadgeVariant(skill.level)}>
                  {levelLabel(skill.level)}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={statusBadgeVariant(skill.status)}>
                  {statusLabel(skill.status)}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border p-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DeleteSkillModalProps {
  skill: AdminSkill | null;
  onClose: () => void;
  onConfirm: (skill: AdminSkill) => void;
}

function DeleteSkillModal({ skill, onClose, onConfirm }: DeleteSkillModalProps) {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-skill-title"
        className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2
            id="delete-skill-title"
            className="flex items-center gap-2 text-md font-semibold text-destructive"
          >
            <ShieldAlert className="h-4 w-4" />
            Hapus Skill
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <p className="text-sm text-foreground/80">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-semibold text-foreground">{skill.name}</span>{" "}
            milik <span className="font-semibold text-foreground">{skill.mentorName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border p-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm(skill)}
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSkillsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSkill, setViewingSkill] = useState<AdminSkill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<AdminSkill | null>(null);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const { skills: rawSkills } = await res.json();
          setSkills(
            (rawSkills || []).map((s: any) => ({
              id: s.id,
              name: s.title,
              category: "Kategori", // Mock fallback since category name isn't fully joined
              mentorName: s.users?.name || "Unknown",
              level: s.level,
              status: "active",
            }))
          );
        }
      } catch {
        // ignore
      }
    }
    loadSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) return skills;
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query) ||
        skill.mentorName.toLowerCase().includes(query)
    );
  }, [skills, searchQuery]);

  function handleToggleStatus(skill: AdminSkill) {
    // Only UI update, backend endpoint doesn't exist yet
    setSkills((prev) =>
      prev.map((item) =>
        item.id === skill.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  }

  function handleConfirmDelete(skill: AdminSkill) {
    // Only UI update
    setSkills((prev) => prev.filter((item) => item.id !== skill.id));
    setDeletingSkill(null);
  }

  function handleAddSkill() {
    alert("Untuk menambah skill, gunakan halaman Explore atau Profile pengguna secara langsung.");
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
                  Skills Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage all skills available on the SkillSwap platform.
                </p>
              </div>
              <Button type="button" onClick={handleAddSkill} className="shrink-0">
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama skill, kategori, atau mentor..."
                className="pl-9"
              />
            </div>

            <Card className="shadow-card">
              {filteredSkills.length === 0 ? (
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tidak ada skill ditemukan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coba gunakan kata kunci pencarian yang lain
                    </p>
                  </div>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Skill Name
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Mentor
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Level
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSkills.map((skill) => (
                        <tr key={skill.id}>
                          <td className="p-4 font-medium text-foreground">
                            {skill.name}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {skill.category}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {skill.mentorName}
                          </td>
                          <td className="p-4">
                            <Badge variant={levelBadgeVariant(skill.level)}>
                              {levelLabel(skill.level)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={statusBadgeVariant(skill.status)}>
                              {statusLabel(skill.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Lihat ${skill.name}`}
                                onClick={() => setViewingSkill(skill)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Ubah status ${skill.name}`}
                                title="Toggle Active/Inactive"
                                onClick={() => handleToggleStatus(skill)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Hapus ${skill.name}`}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setDeletingSkill(skill)}
                              >
                                <Trash2 className="h-4 w-4" />
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

      <ViewSkillModal skill={viewingSkill} onClose={() => setViewingSkill(null)} />
      <DeleteSkillModal
        skill={deletingSkill}
        onClose={() => setDeletingSkill(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}