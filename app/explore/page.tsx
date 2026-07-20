"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Star, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { CategoryFilter, type Category } from "@/components/dashboard/CategoryFilter";
import { MentorCard } from "@/components/dashboard/MentorCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type SkillLevel = "beginner" | "intermediate" | "advanced";

interface Mentor {
  id: string;
  name: string;
  department: string;
  avatarUrl?: string;
  skillName: string;
  skillId: string;
  categoryId: string;
  level: SkillLevel;
  rating: number;
}

export default function ExplorePage() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load categories
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const { categories: rawCats } = await catRes.json();
          setCategories(
            (rawCats || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              iconEmoji: c.icon,
            }))
          );
        }

        // Load mentors (from skills table)
        const skillRes = await fetch("/api/skills");
        if (skillRes.ok) {
          const { skills } = await skillRes.json();
          const loadedMentors: Mentor[] = (skills || []).map((s: any) => ({
            id: s.users?.id + "-" + s.id, // Supaya unik di UI kalau 1 user punya banyak skill
            name: s.users?.name || "Unknown",
            department: s.users?.department || "Unknown",
            avatarUrl: s.users?.avatar || undefined,
            skillName: s.title,
            skillId: s.id,
            categoryId: s.category_id,
            level: s.level,
            rating: 5.0, // Default for now
          }));
          setMentors(loadedMentors);
        }
      } catch {
        // ignore
      }
    }
    loadData();
  }, []);

  const filteredMentors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return mentors.filter((mentor) => {
      const matchesCategory =
        activeCategory === null || mentor.categoryId === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        mentor.name.toLowerCase().includes(query) ||
        mentor.skillName.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory, mentors]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search mentor..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Explore
              </h1>
              <p className="text-sm text-muted-foreground">
                Temukan mentor dan skill yang ingin kamu pelajari
              </p>
            </div>

            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search mentor..."
              />
              <CategoryFilter
                categories={categories}
                activeCategoryId={activeCategory}
                onChange={setActiveCategory}
              />
            </div>

            {filteredMentors.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <Compass className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tidak ada hasil ditemukan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coba gunakan kata kunci lain atau pilih kategori yang
                      berbeda
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            )}
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}