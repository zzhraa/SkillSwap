"use client";

import type { ElementType } from "react";
import { useMemo, useState } from "react";
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

const categories: SkillCategoryOption[] = [
  { id: "cat-teknologi", name: "Teknologi", iconEmoji: "💻" },
  { id: "cat-desain", name: "Desain", iconEmoji: "🎨" },
  { id: "cat-bahasa", name: "Bahasa", iconEmoji: "🌍" },
  { id: "cat-bisnis", name: "Bisnis", iconEmoji: "📊" },
  { id: "cat-seni", name: "Seni & Musik", iconEmoji: "🎵" },
  { id: "cat-akademik", name: "Akademik", iconEmoji: "📚" },
  { id: "cat-sport", name: "Kesehatan & Sport", iconEmoji: "⚽" },
];

function categoryName(categoryId: string) {
  return (
    categories.find((category) => category.id === categoryId)?.name ??
    "Lainnya"
  );
}

const initialSkills: Skill[] = [
  {
    id: "skill-1",
    name: "React.js",
    categoryId: "cat-teknologi",
    categoryName: "Teknologi",
    level: "advanced",
    description:
      "Membangun antarmuka web modern dengan React, hooks, dan state management.",
    hasActiveRequest: true,
  },
  {
    id: "skill-2",
    name: "Next.js",
    categoryId: "cat-teknologi",
    categoryName: "Teknologi",
    level: "intermediate",
    description:
      "Full-stack development dengan Next.js App Router dan Supabase.",
    hasActiveRequest: false,
  },
  {
    id: "skill-3",
    name: "Public Speaking",
    categoryId: "cat-bisnis",
    categoryName: "Bisnis",
    level: "beginner",
    description: "Dasar-dasar presentasi dan komunikasi di depan umum.",
    hasActiveRequest: false,
  },
];

export default function ProfilePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [profile, setProfile] = useState<ProfileFormValues>({
    fullName: "Dimas Pratama",
    bio: "Mahasiswa Teknik Informatika, suka membangun aplikasi web dan berbagi ilmu programming ke teman-teman kampus.",
    avatarUrl: undefined,
  });
  const [department] = useState("Teknik Informatika, Semester 6");
  const [totalSessions] = useState(12);
  const [averageRating] = useState(4.8);

  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const totalSkills = useMemo(() => skills.length, [skills]);

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

  function handleSaveSkill(values: SkillFormValues) {
    if (values.id) {
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === values.id
            ? {
                ...skill,
                name: values.name,
                categoryId: values.categoryId,
                categoryName: categoryName(values.categoryId),
                level: values.level,
                description: values.description,
              }
            : skill
        )
      );
      return;
    }

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: values.name,
      categoryId: values.categoryId,
      categoryName: categoryName(values.categoryId),
      level: values.level,
      description: values.description,
      hasActiveRequest: false,
    };
    setSkills((prev) => [newSkill, ...prev]);
  }

  function handleDeleteSkill(skill: Skill) {
    if (skill.hasActiveRequest) return;
    setSkills((prev) => prev.filter((item) => item.id !== skill.id));
  }

  function handleSaveProfile(values: ProfileFormValues) {
    setProfile(values);

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: values.fullName,
        email: "dimas.pratama@student.ac.id",
        avatarUrl: values.avatarUrl,
      })
    );
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