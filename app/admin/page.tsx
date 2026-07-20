"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Sparkles, FolderKanban, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStat {
  label: string;
  value: string;
  icon: React.ElementType;
}

  const [stats, setStats] = useState<AdminStat[]>([
    { label: "Total Users", value: "...", icon: Users },
    { label: "Total Skills", value: "...", icon: Sparkles },
    { label: "Total Categories", value: "...", icon: FolderKanban },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          const s = data.stats || {};
          setStats([
            { label: "Total Users", value: String(s.totalUsers || 0), icon: Users },
            { label: "Total Skills", value: String(s.totalSkills || 0), icon: Sparkles },
            { label: "Total Requests", value: String(s.totalRequests || 0), icon: FolderKanban },
          ]);
        }
      } catch {
        // ignore
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Selamat datang, Admin. Kelola pengguna, skill, dan kategori
                platform SkillSwap di sini.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="shadow-card">
                    <CardContent className="flex items-center gap-3 p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xl font-semibold text-foreground">
                          {stat.value}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="shadow-card">
              <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Kelola Kategori Skill
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tambah, ubah, atau hapus kategori yang digunakan di
                    seluruh platform
                  </p>
                </div>
                <Button
                  type="button"
                  className="shrink-0"
                  onClick={() => router.push("/admin/categories")}
                >
                  Kelola Kategori
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}