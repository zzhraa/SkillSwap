"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryStat {
  label: string;
  value: string;
  icon: React.ElementType;
}

const summaryStats: SummaryStat[] = [
  { label: "Total Users", value: "1,248", icon: Users },
  { label: "Active Mentors", value: "312", icon: Sparkles },
  { label: "Total Skills", value: "486", icon: BookOpen },
  { label: "Total Categories", value: "7", icon: Layers },
  { label: "Total Requests", value: "2,974", icon: MessageSquare },
  { label: "Total Learning Sessions", value: "1,865", icon: CheckCircle2 },
];

interface BarDatum {
  label: string;
  value: number;
}

const monthlyRegistrations: BarDatum[] = [
  { label: "Jan", value: 62 },
  { label: "Feb", value: 78 },
  { label: "Mar", value: 91 },
  { label: "Apr", value: 84 },
  { label: "May", value: 103 },
  { label: "Jun", value: 96 },
  { label: "Jul", value: 118 },
];

const categoryDistribution: BarDatum[] = [
  { label: "Teknologi", value: 132 },
  { label: "Desain", value: 88 },
  { label: "Bahasa", value: 76 },
  { label: "Bisnis", value: 64 },
  { label: "Seni & Musik", value: 58 },
  { label: "Akademik", value: 45 },
  { label: "Kesehatan & Sport", value: 23 },
];

const popularSkills: BarDatum[] = [
  { label: "React.js", value: 214 },
  { label: "UI/UX Design", value: 178 },
  { label: "Conversational English", value: 156 },
  { label: "Public Speaking", value: 132 },
  { label: "Bahasa Jepang", value: 97 },
];

type ActivityStatus = "completed" | "pending" | "cancelled";

interface ActivityRecord {
  id: string;
  user: string;
  activity: string;
  date: string;
  status: ActivityStatus;
}

const recentActivity: ActivityRecord[] = [
  {
    id: "act-1",
    user: "Dimas Pratama",
    activity: "Menyelesaikan sesi belajar React.js",
    date: "2026-07-18",
    status: "completed",
  },
  {
    id: "act-2",
    user: "Rina Kusuma",
    activity: "Mengirim learning request untuk UI/UX Design",
    date: "2026-07-18",
    status: "pending",
  },
  {
    id: "act-3",
    user: "Sari Dewi",
    activity: "Menambahkan skill baru: Conversational English",
    date: "2026-07-17",
    status: "completed",
  },
  {
    id: "act-4",
    user: "Bayu Aditya",
    activity: "Membatalkan learning request Public Speaking",
    date: "2026-07-17",
    status: "cancelled",
  },
  {
    id: "act-5",
    user: "Putri Amalia",
    activity: "Menerima request belajar Gitar Akustik",
    date: "2026-07-16",
    status: "completed",
  },
  {
    id: "act-6",
    user: "Fajar Nugroho",
    activity: "Memberikan review untuk sesi Kalkulus Dasar",
    date: "2026-07-16",
    status: "completed",
  },
  {
    id: "act-7",
    user: "Citra Ramadhani",
    activity: "Mendaftar akun baru sebagai mentor",
    date: "2026-07-15",
    status: "pending",
  },
  {
    id: "act-8",
    user: "Yusuf Hakim",
    activity: "Mengirim learning request untuk Bahasa Jepang",
    date: "2026-07-15",
    status: "pending",
  },
  {
    id: "act-9",
    user: "Melati Anggraini",
    activity: "Menolak learning request Manajemen Proyek",
    date: "2026-07-14",
    status: "cancelled",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeVariant(status: ActivityStatus) {
  if (status === "completed") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "destructive" as const;
}

function statusLabel(status: ActivityStatus) {
  if (status === "completed") return "Completed";
  if (status === "pending") return "Pending";
  return "Cancelled";
}

function statusIcon(status: ActivityStatus) {
  if (status === "completed") return CheckCircle2;
  if (status === "pending") return Clock;
  return XCircle;
}

interface BarChartCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  data: BarDatum[];
  barColorClassName?: string;
}

function BarChartCard({
  title,
  description,
  icon: Icon,
  data,
  barColorClassName = "bg-primary",
}: BarChartCardProps) {
  const maxValue = useMemo(
    () => Math.max(...data.map((item) => item.value), 1),
    [data]
  );

  return (
    <Card className="shadow-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-md font-semibold text-foreground">
              {title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item) => {
            const widthPercent = Math.round((item.value / maxValue) * 100);
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                  <div
                    className={cn("h-full rounded-full", barColorClassName)}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

type ReportRange = "7d" | "30d" | "90d";

const rangeOptions: { value: ReportRange; label: string }[] = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "90d", label: "90 Hari" },
];

export default function AdminReportsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<ReportRange>("30d");

  const sortedActivity = useMemo(
    () =>
      [...recentActivity].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">
                  Reports & Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Overview of SkillSwap platform statistics.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {rangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selectedRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
              {summaryStats.map((stat) => {
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

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <BarChartCard
                title="Monthly Registrations"
                description="Pendaftaran pengguna baru per bulan"
                icon={TrendingUp}
                data={monthlyRegistrations}
              />
              <BarChartCard
                title="Skill Categories Distribution"
                description="Jumlah skill per kategori"
                icon={Layers}
                data={categoryDistribution}
                barColorClassName="bg-success"
              />
              <BarChartCard
                title="Most Popular Skills"
                description="Skill dengan request terbanyak"
                icon={Sparkles}
                data={popularSkills}
                barColorClassName="bg-warning"
              />
            </div>

            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-md font-semibold text-foreground">
                    Recent Activity
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-3 text-xs font-medium text-muted-foreground">
                          User
                        </th>
                        <th className="p-3 text-xs font-medium text-muted-foreground">
                          Activity
                        </th>
                        <th className="p-3 text-xs font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="p-3 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sortedActivity.map((record) => {
                        const StatusIcon = statusIcon(record.status);
                        return (
                          <tr key={record.id}>
                            <td className="p-3 font-medium text-foreground">
                              {record.user}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {record.activity}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {formatDate(record.date)}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={statusBadgeVariant(record.status)}
                                className="gap-1"
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusLabel(record.status)}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}