"use client";

import { useState } from "react";
import { Menu, Search, X, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  onMenuClick?: () => void;
  hasNotifications?: boolean;
  searchPlaceholder?: string;
}

const currentUser = {
  name: "Dimas Pratama",
  avatarUrl: undefined as string | undefined,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopNavbar({
  onMenuClick,
  hasNotifications = true,
  searchPlaceholder = "Search mentor or skill...",
}: TopNavbarProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-md p-1.5 text-foreground/70 hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 sm:max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "h-9 w-full rounded-md border border-border bg-background pl-9 pr-8 text-sm",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-1 focus:ring-primary"
            )}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-md p-1.5 text-foreground/70 hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>

        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {getInitials(currentUser.name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}