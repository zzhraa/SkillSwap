// app/settings/page.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Lock,
  Shield,
  User,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { cn } from "@/lib/utils";
import {
  ProfileSettings,
  type ProfileSettingsValues,
} from "@/components/settings/ProfileSettings";
import {
  AccountSettings,
  type AccountSettingsValues,
} from "@/components/settings/AccountSettings";
import {
  NotificationSettings,
  type NotificationSettingsValues,
} from "@/components/settings/NotificationSettings";
import {
  PrivacySettings,
  type PrivacySettingsValues,
} from "@/components/settings/PrivacySettings";
import { DangerZone } from "@/components/settings/DangerZone";

type SettingsSection = "profile" | "account" | "notifications" | "privacy" | "danger";

interface SectionNavItem {
  id: SettingsSection;
  label: string;
  icon: React.ElementType;
}

const sectionNavItems: SectionNavItem[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "account", label: "Akun", icon: Lock },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "privacy", label: "Privasi", icon: Shield },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function SettingsPage() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const [profile, setProfile] = useState<ProfileSettingsValues>({
    fullName: "Dimas Pratama",
    bio: "Mahasiswa Teknik Informatika, suka membangun aplikasi web dan berbagi ilmu programming ke teman-teman kampus.",
    avatarUrl: undefined,
  });

  const [account, setAccount] = useState<AccountSettingsValues>({
    email: "dimas.pratama@kampus.ac.id",
  });

  const [notifications, setNotifications] = useState<NotificationSettingsValues>({
    pushNewRequest: true,
    pushRequestUpdate: true,
    pushNewMessage: true,
    emailNewRequest: true,
    emailWeeklySummary: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettingsValues>({
    profileVisibility: "public",
    requestPreference: "everyone",
  });

  function handleSaveProfile(values: ProfileSettingsValues) {
    setProfile(values);
  }

  function handleSaveEmail(email: string) {
    setAccount((prev) => ({ ...prev, email }));
  }

  function handleChangePassword(values: {
    currentPassword: string;
    newPassword: string;
  }) {
    // integrate with Supabase Auth password update
    console.log("change password", values);
  }

  function handleLogout() {
    // integrate with Supabase Auth sign out
    console.log("logout");
  }

  function handleDeleteAccount() {
    // integrate with account deletion flow
    console.log("delete account");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-60 flex-col bg-card">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-md font-semibold text-foreground">
                SkillSwap
              </span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search settings..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Pengaturan
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola profil, akun, notifikasi, dan privasi kamu
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:col-span-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {sectionNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeSection;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:shrink",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground",
                        item.id === "danger" && !isActive && "text-destructive/80"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="space-y-4 lg:col-span-4">
                {activeSection === "profile" && (
                  <ProfileSettings
                    initialValues={profile}
                    onSave={handleSaveProfile}
                  />
                )}
                {activeSection === "account" && (
                  <AccountSettings
                    initialValues={account}
                    onSaveEmail={handleSaveEmail}
                    onChangePassword={handleChangePassword}
                  />
                )}
                {activeSection === "notifications" && (
                  <NotificationSettings
                    initialValues={notifications}
                    onChange={setNotifications}
                  />
                )}
                {activeSection === "privacy" && (
                  <PrivacySettings
                    initialValues={privacy}
                    onChange={setPrivacy}
                  />
                )}
                {activeSection === "danger" && (
                  <DangerZone
                    onLogout={handleLogout}
                    onDeleteAccount={handleDeleteAccount}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}