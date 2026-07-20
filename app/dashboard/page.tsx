"use client";

import type { ElementType } from "react";
import { useEffect, useState } from "react";
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
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { FeaturedMentors } from "@/components/dashboard/FeaturedMentors";

interface MobileNavItem {
  label: string;
  href: string;
  icon: ElementType;
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
  icon: ElementType;
}

type SkillLevel = "beginner" | "intermediate" | "advanced";

interface MentorData {
  id: string;
  name: string;
  department: string;
  skillName: string;
  skillId: string;
  level: SkillLevel;
  rating: number;
}

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState("Loading...");
  
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Skill Aktif", value: "0", icon: Sparkles },
    { label: "Sesi Selesai", value: "0", icon: BookOpen },
    { label: "Rating Rata-rata", value: "0", icon: Star },
    { label: "Request Masuk", value: "0", icon: Users },
  ]);

  const [featuredMentors, setFeaturedMentors] = useState<MentorData[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load User
        const meRes = await fetch("/api/auth/me");
        let userId = null;
        if (meRes.ok) {
          const { user } = await meRes.json();
          setName(user.name.split(" ")[0]);
          userId = user.id;
        }

        if (userId) {
          // Load Skills count
          const skillsRes = await fetch(`/api/skills?userId=${userId}`);
          let skillCount = 0;
          if (skillsRes.ok) {
            const { skills } = await skillsRes.json();
            skillCount = skills?.length || 0;
          }

          // Load Requests (Sesi Selesai & Request Masuk)
          const reqRes = await fetch("/api/requests");
          let completed = 0;
          let incoming = 0;
          if (reqRes.ok) {
            const { requests } = await reqRes.json();
            completed = requests.filter((r: any) => r.status === "completed").length;
            incoming = requests.filter((r: any) => r.status === "pending" && r.receiver.id === userId).length;
          }

          // Load Reviews
          const revRes = await fetch(`/api/reviews?mentorId=${userId}`);
          let avgRating = 0;
          if (revRes.ok) {
            const { reviews } = await revRes.json();
            if (reviews && reviews.length > 0) {
              const total = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
              avgRating = total / reviews.length;
            }
          }

          setStats([
            { label: "Skill Aktif", value: skillCount.toString(), icon: Sparkles },
            { label: "Sesi Selesai", value: completed.toString(), icon: BookOpen },
            { label: "Rating Rata-rata", value: avgRating.toFixed(1), icon: Star },
            { label: "Request Masuk", value: incoming.toString(), icon: Users },
          ]);
        }

        // Load Featured Mentors (Skills from DB)
        const allSkillsRes = await fetch("/api/skills");
        if (allSkillsRes.ok) {
          const { skills } = await allSkillsRes.json();
          const mentors: MentorData[] = (skills || [])
            .slice(0, 4) // Ambil 4 teratas (bisa disesuaikan logic-nya)
            .map((s: any) => ({
              id: (s.users?.id || "unknown") + "-" + s.id,
              name: s.users?.name || "Unknown User",
              department: s.users?.department || "Unknown Dept",
              skillName: s.title,
              skillId: s.id,
              level: s.level,
              rating: 5.0, // Default rating sementara karena butuh logic agregasi rating per skill
            }));
          setFeaturedMentors(mentors);
        }

      } catch {
        // error handled silently
      }
    }
    
    loadData();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search..." />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <WelcomeBanner name={name} stats={stats as any} />
            <FeaturedMentors mentors={featuredMentors} />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}