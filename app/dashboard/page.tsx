"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Inbox,
  MessageSquare,
  User,
  Star,
  BookOpen,
  Users,
  Sparkles,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
}

const stats: StatCard[] = [
  { label: "Skill Aktif", value: "4", icon: Sparkles },
  { label: "Sesi Selesai", value: "12", icon: BookOpen },
  { label: "Rating Rata-rata", value: "4.8", icon: Star },
  { label: "Request Masuk", value: "3", icon: Users },
];

type SkillLevel = "beginner" | "intermediate" | "advanced";

interface Mentor {
  id: string;
  name: string;
  department: string;
  skillName: string;
  level: SkillLevel;
  rating: number;
}

const featuredMentors: Mentor[] = [
  {
    id: "1",
    name: "Dimas Pratama",
    department: "Teknik Informatika",
    skillName: "React.js",
    level: "advanced",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Sari Dewi",
    department: "Desain Komunikasi Visual",
    skillName: "UI/UX Design",
    level: "intermediate",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Rina Kusuma",
    department: "Sastra Jepang",
    skillName: "Bahasa Jepang",
    level: "beginner",
    rating: 4.6,
  },
  {
    id: "4",
    name: "Budi Santoso",
    department: "Manajemen",
    skillName: "Public Speaking",
    level: "advanced",
    rating: 5.0,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvatarColorClass(name: string) {
  const tints = [
    "bg-accent text-accent-foreground",
    "bg-warning/15 text-warning",
    "bg-success/15 text-success",
    "bg-destructive/15 text-destructive",
  ];
  const index = (name.charCodeAt(0) || 0) % tints.length;
  return tints[index];
}

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

function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-border bg-card lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-2xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
            {typeof item.badge === "number" && item.badge > 0 && (
              <span className="absolute right-4 top-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function WelcomeBanner() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">
        Selamat datang kembali, Dimas
      </h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center gap-3 p-5">
        <Avatar className="h-9 w-9">
          <AvatarImage src={undefined} alt={mentor.name} />
          <AvatarFallback className={getAvatarColorClass(mentor.name)}>
            {getInitials(mentor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-md font-semibold text-foreground">
            {mentor.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {mentor.department}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-5 pt-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {mentor.skillName}
          </p>
          <Badge variant={levelBadgeVariant(mentor.level)}>
            {levelLabel(mentor.level)}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(mentor.rating)
                    ? "fill-star text-star"
                    : "text-border"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            {mentor.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5">
        <Button className="w-full">Kirim Request</Button>
      </CardFooter>
    </Card>
  );
}

function FeaturedMentors() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold text-foreground">
          Mentor Unggulan
        </h2>
        <Link
          href="/explore"
          className="text-sm font-medium text-primary hover:underline"
        >
          Lihat semua
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featuredMentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <WelcomeBanner />
            <FeaturedMentors />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}