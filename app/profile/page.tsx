"use client";

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

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Requests", href: "/requests", icon: Inbox, badge: 3 },
  { label: "Chat", href: "/chat", icon: MessageSquare, badge: 2 },
  { label: "Profile", href: "/profile", icon: User },
];

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

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-60 flex-col bg-card">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-md font-semibold text-foreground">
            SkillSwap
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-2xs font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

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