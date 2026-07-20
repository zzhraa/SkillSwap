// app/settings/page.tsx
"use client";

import type { ElementType } from "react";
import { useEffect, useState } from "react";
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
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
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
  icon: ElementType;
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

  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileSettingsValues>({
    fullName: "Loading...",
    bio: "",
    avatarUrl: undefined,
  });

  const [account, setAccount] = useState<AccountSettingsValues>({
    email: "loading...",
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

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const { user } = await res.json();
          setUserId(user.id);
          setProfile({
            fullName: user.name || "",
            bio: user.bio || "",
            avatarUrl: user.avatar || undefined,
          });
          setAccount({ email: user.email || "" });
        }
      } catch {
        // ignore
      }
    }
    loadData();
  }, []);

  async function handleSaveProfile(values: ProfileSettingsValues) {
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
      if (res.ok) setProfile(values);
    } catch {
      // ignore
    }
  }

  function handleSaveEmail(email: string) {
    alert("Fitur ganti email sedang dalam tahap pengembangan.");
  }

  async function handleChangePassword(values: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Gagal ubah password: " + (data.error || "Error"));
      } else {
        alert("Password berhasil diubah! Silakan login kembali dengan password baru Anda.");
        handleLogout();
      }
    } catch {
      alert("Terjadi kesalahan sistem saat mengubah password.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      // ignore
    }
  }

  function handleDeleteAccount() {
    alert("Fitur hapus akun sedang dalam tahap pengembangan.");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
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