"use client";

import type { ElementType } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Inbox,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { SkillList, type Skill } from "@/components/profile/SkillList";
import {
  AddSkillModal,
  type SkillCategoryOption,
  type SkillFormValues,
} from "@/components/profile/AddSkillModal";
import {
  EditProfileModal,
  type ProfileFormValues,
} from "@/components/profile/EditProfileModal";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileFormValues>({
    fullName: "",
    bio: "",
    avatarUrl: undefined,
  });
  const [department, setDepartment] = useState("");
  const [totalSessions] = useState(0);
  const [averageRating] = useState(0);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategoryOption[]>([]);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const totalSkills = useMemo(() => skills.length, [skills]);

  // ── Fetch current user + skills + categories on mount ──────────────────
  useEffect(() => {
    async function load() {
      try {
        // 1. Get current user
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) return;
        const { user } = await meRes.json();
        setUserId(user.id);
        setProfile({ fullName: user.name ?? "", bio: user.bio ?? "", avatarUrl: user.avatar ?? undefined });
        setDepartment(user.department ?? "");

        // 2. Get skills milik user ini
        const skillsRes = await fetch(`/api/skills?userId=${user.id}`);
        if (skillsRes.ok) {
          const { skills: rawSkills } = await skillsRes.json();
          setSkills(
            (rawSkills ?? []).map((s: any) => ({
              id: s.id,
              name: s.title,
              categoryId: s.category_id ?? "",
              categoryName: s.categories?.name ?? "Lainnya",
              level: s.level,
              description: s.description ?? "",
              hasActiveRequest: false,
            }))
          );
        }

        // 3. Get categories untuk modal
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const { categories: rawCats } = await catRes.json();
          setCategories(
            (rawCats ?? []).map((c: any) => ({
              id: c.id,
              name: c.name,
              iconEmoji: c.icon,
            }))
          );
        }
      } catch {
        // gagal load, biarkan state kosong
      }
    }
    load();
  }, []);

  function handleOpenAddSkill() {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  }

  function handleOpenEditSkill(skill: Skill) {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  }

  function handleCloseSkillModal() {
    setIsSkillModalOpen(false);
    setEditingSkill(null);
  }

  async function handleSaveSkill(values: SkillFormValues) {
    try {
      if (values.id) {
        // Edit skill yang ada
        const res = await fetch(`/api/skills/${values.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.name,
            level: values.level,
            categoryId: values.categoryId,
            description: values.description,
          }),
        });
        if (res.ok) {
          const catName = categories.find((c) => c.id === values.categoryId)?.name ?? "Lainnya";
          setSkills((prev) =>
            prev.map((skill) =>
              skill.id === values.id
                ? { ...skill, name: values.name, categoryId: values.categoryId, categoryName: catName, level: values.level, description: values.description }
                : skill
            )
          );
        }
      } else {
        // Tambah skill baru
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.name,
            level: values.level,
            categoryId: values.categoryId,
            description: values.description,
          }),
        });
        if (res.ok) {
          const { skill } = await res.json();
          const catName = categories.find((c) => c.id === values.categoryId)?.name ?? "Lainnya";
          setSkills((prev) => [
            {
              id: skill.id,
              name: values.name,
              categoryId: values.categoryId,
              categoryName: catName,
              level: values.level,
              description: values.description,
              hasActiveRequest: false,
            },
            ...prev,
          ]);
        }
      }
    } catch {
      // error handling
    }
  }

  async function handleDeleteSkill(skill: Skill) {
    if (skill.hasActiveRequest) return;
    try {
      const res = await fetch(`/api/skills/${skill.id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills((prev) => prev.filter((item) => item.id !== skill.id));
      }
    } catch {
      // error handling
    }
  }

  async function handleSaveProfile(values: ProfileFormValues) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.fullName,
          bio: values.bio,
          avatar: values.avatarUrl,
        }),
      });
      if (res.ok) {
        setProfile(values);
      }
    } catch {
      // error handling
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search skills..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <ProfileHeader
              name={profile.fullName}
              department={department}
              bio={profile.bio}
              avatarUrl={profile.avatarUrl}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />

            <ProfileInfoCard
              totalSkills={totalSkills}
              totalSessions={totalSessions}
              averageRating={averageRating}
            />

            <SkillList
              skills={skills}
              onAddSkill={handleOpenAddSkill}
              onEditSkill={handleOpenEditSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>
        </main>
        <BottomNavigation />
      </div>

      <EditProfileModal
        open={isEditProfileOpen}
        profile={profile}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <AddSkillModal
        open={isSkillModalOpen}
        categories={categories}
        skill={editingSkill}
        onClose={handleCloseSkillModal}
        onSave={handleSaveSkill}
      />
    </div>
  );
}