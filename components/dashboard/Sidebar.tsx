"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Inbox,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Users,
  Sparkles,
  Layers,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const primaryNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "My Requests", href: "/requests", icon: Inbox, badge: 3 },
  { label: "Chat", href: "/chat", icon: MessageSquare, badge: 2 },
];

const accountNavItems: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Skills", href: "/admin/skills", icon: Sparkles },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

interface CurrentUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

const currentUser: CurrentUser = {
  name: "Dimas Pratama",
  email: "dimas.pratama@student.ac.id",
};

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

function NavList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-2xs font-medium",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    router.replace("/login");
  }

  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            S
          </span>
          <span className="text-md font-semibold text-foreground">
            SkillSwap{isAdmin ? " Admin" : ""}
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {isAdmin ? (
          <NavList items={adminNavItems} pathname={pathname ?? ""} />
        ) : (
          <>
            <NavList items={primaryNavItems} pathname={pathname ?? ""} />
            <div>
              <p className="px-3 pb-2 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
                Account
              </p>
              <NavList items={accountNavItems} pathname={pathname ?? ""} />
            </div>
          </>
        )}
      </nav>

      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className={getAvatarColorClass(currentUser.name)}>
            {getInitials(currentUser.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {currentUser.name}
          </p>
          <p className="truncate text-2xs text-muted-foreground">
            {currentUser.email}
          </p>
        </div>
        <button
          type="button"
          aria-label="Logout"
          onClick={handleLogout}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}