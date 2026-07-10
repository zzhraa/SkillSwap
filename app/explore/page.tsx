"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Star, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { SearchBar } from "@/components/explore/SearchBar";
import { CategoryFilter, type CategoryFilterOption } from "@/components/explore/CategoryFilter";
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
  categoryId: string;
  level: SkillLevel;
  rating: number;
}

const categories: CategoryFilterOption[] = [
  { id: "all", name: "Semua" },
  { id: "cat-teknologi", name: "Teknologi", iconEmoji: "💻" },
  { id: "cat-desain", name: "Desain", iconEmoji: "🎨" },
  { id: "cat-bahasa", name: "Bahasa", iconEmoji: "🌍" },
  { id: "cat-bisnis", name: "Bisnis", iconEmoji: "📊" },
  { id: "cat-seni", name: "Seni & Musik", iconEmoji: "🎵" },
  { id: "cat-akademik", name: "Akademik", iconEmoji: "📚" },
  { id: "cat-sport", name: "Kesehatan & Sport", iconEmoji: "⚽" },
];

const mentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Dimas Pratama",
    department: "Teknik Informatika",
    skillName: "React.js",
    categoryId: "cat-teknologi",
    level: "advanced",
    rating: 4.8,
  },
  {
    id: "mentor-2",
    name: "Rina Kusuma",
    department: "Desain Komunikasi Visual",
    skillName: "UI/UX Design",
    categoryId: "cat-desain",
    level: "intermediate",
    rating: 4.6,
  },
  {
    id: "mentor-3",
    name: "Sari Dewi",
    department: "Sastra Inggris",
    skillName: "Conversational English",
    categoryId: "cat-bahasa",
    level: "advanced",
    rating: 4.9,
  },
  {
    id: "mentor-4",
    name: "Bayu Aditya",
    department: "Manajemen",
    skillName: "Public Speaking",
    categoryId: "cat-bisnis",
    level: "beginner",
    rating: 4.2,
  },
  {
    id: "mentor-5",
    name: "Putri Amalia",
    department: "Seni Musik",
    skillName: "Gitar Akustik",
    categoryId: "cat-seni",
    level: "intermediate",
    rating: 4.7,
  },
  {
    id: "mentor-6",
    name: "Fajar Nugroho",
    department: "Fisika",
    skillName: "Kalkulus Dasar",
    categoryId: "cat-akademik",
    level: "advanced",
    rating: 4.5,
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

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-start gap-3 p-5">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
          <AvatarFallback className={getAvatarColorClass(mentor.name)}>
            {getInitials(mentor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-md font-semibold text-foreground">
            {mentor.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {mentor.department}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-5 pt-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
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
                  "h-3.5 w-3.5",
                  star <= Math.round(mentor.rating)
                    ? "fill-star text-star"
                    : "text-border"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">
            {mentor.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5">
        <Button type="button" className="w-full">
          Kirim Request
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ExplorePage() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMentors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return mentors.filter((mentor) => {
      const matchesCategory =
        activeCategory === "all" || mentor.categoryId === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        mentor.name.toLowerCase().includes(query) ||
        mentor.skillName.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex h-screen">
      <Sidebar />
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