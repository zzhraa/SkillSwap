"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Search, ShieldAlert, Trash2, Users, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "user";
type UserStatus = "active" | "inactive";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
}

const initialUsers: AdminUser[] = [
  {
    id: "user-1",
    fullName: "Dimas Pratama",
    email: "dimas.pratama@kampus.ac.id",
    role: "admin",
    status: "active",
    joinedDate: "2025-08-12",
  },
  {
    id: "user-2",
    fullName: "Rina Kusuma",
    email: "rina.kusuma@kampus.ac.id",
    role: "user",
    status: "active",
    joinedDate: "2025-09-03",
  },
  {
    id: "user-3",
    fullName: "Sari Dewi",
    email: "sari.dewi@kampus.ac.id",
    role: "user",
    status: "inactive",
    joinedDate: "2025-09-20",
  },
  {
    id: "user-4",
    fullName: "Bayu Aditya",
    email: "bayu.aditya@kampus.ac.id",
    role: "user",
    status: "active",
    joinedDate: "2025-10-01",
  },
  {
    id: "user-5",
    fullName: "Putri Amalia",
    email: "putri.amalia@kampus.ac.id",
    role: "user",
    status: "active",
    joinedDate: "2025-10-14",
  },
  {
    id: "user-6",
    fullName: "Fajar Nugroho",
    email: "fajar.nugroho@kampus.ac.id",
    role: "user",
    status: "inactive",
    joinedDate: "2025-11-02",
  },
  {
    id: "user-7",
    fullName: "Citra Ramadhani",
    email: "citra.ramadhani@kampus.ac.id",
    role: "admin",
    status: "active",
    joinedDate: "2025-11-19",
  },
  {
    id: "user-8",
    fullName: "Yusuf Hakim",
    email: "yusuf.hakim@kampus.ac.id",
    role: "user",
    status: "active",
    joinedDate: "2025-12-05",
  },
  {
    id: "user-9",
    fullName: "Melati Anggraini",
    email: "melati.anggraini@kampus.ac.id",
    role: "user",
    status: "inactive",
    joinedDate: "2026-01-08",
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

function roleBadgeVariant(role: UserRole) {
  return role === "admin" ? ("default" as const) : ("outline" as const);
}

function roleLabel(role: UserRole) {
  return role === "admin" ? "Admin" : "User";
}

function statusBadgeVariant(status: UserStatus) {
  return status === "active" ? ("success" as const) : ("warning" as const);
}

function statusLabel(status: UserStatus) {
  return status === "active" ? "Active" : "Inactive";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ViewUserModalProps {
  user: AdminUser | null;
  onClose: () => void;
}

function ViewUserModal({ user, onClose }: ViewUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-user-title"
        className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2
            id="view-user-title"
            className="text-md font-semibold text-foreground"
          >
            Detail Pengguna
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className={cn("text-lg", getAvatarColorClass(user.fullName))}>
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-md font-semibold text-foreground">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd>
                <Badge variant={roleBadgeVariant(user.role)}>
                  {roleLabel(user.role)}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={statusBadgeVariant(user.status)}>
                  {statusLabel(user.status)}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs text-muted-foreground">Joined Date</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatDate(user.joinedDate)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border p-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DeleteUserModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onConfirm: (user: AdminUser) => void;
}

function DeleteUserModal({ user, onClose, onConfirm }: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-dropdown"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2
            id="delete-user-title"
            className="flex items-center gap-2 text-md font-semibold text-destructive"
          >
            <ShieldAlert className="h-4 w-4" />
            Hapus Pengguna
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <p className="text-sm text-foreground/80">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-semibold text-foreground">
              {user.fullName}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border p-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm(user)}
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const { users: rawUsers } = await res.json();
          setUsers(
            (rawUsers || []).map((u: any) => ({
              id: u.id,
              fullName: u.name || "Unknown",
              email: u.email,
              role: u.role || "user",
              status: "active", // Default since no is_active column
              joinedDate: u.created_at,
            }))
          );
        }
      } catch {
        // ignore
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) return users;
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  function handleToggleStatus(user: AdminUser) {
    // API endpoint for this doesn't exist yet, just UI update
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  }

  function handleConfirmDelete(user: AdminUser) {
    // API endpoint for this doesn't exist yet, just UI update
    setUsers((prev) => prev.filter((item) => item.id !== user.id));
    setDeletingUser(null);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Users Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage all registered SkillSwap users.
              </p>
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama atau email pengguna..."
                className="pl-9"
              />
            </div>

            <Card className="shadow-card">
              {filteredUsers.length === 0 ? (
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <Users className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tidak ada pengguna ditemukan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coba gunakan kata kunci pencarian yang lain
                    </p>
                  </div>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Avatar
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Full Name
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Role
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Joined Date
                        </th>
                        <th className="p-4 text-xs font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="p-4">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                              <AvatarFallback className={getAvatarColorClass(user.fullName)}>
                                {getInitials(user.fullName)}
                              </AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="p-4 font-medium text-foreground">
                            {user.fullName}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="p-4">
                            <Badge variant={roleBadgeVariant(user.role)}>
                              {roleLabel(user.role)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={statusBadgeVariant(user.status)}>
                              {statusLabel(user.status)}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(user.joinedDate)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Lihat ${user.fullName}`}
                                onClick={() => setViewingUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Ubah status ${user.fullName}`}
                                title="Toggle Active/Inactive"
                                onClick={() => handleToggleStatus(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Hapus ${user.fullName}`}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setDeletingUser(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>

      <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} />
      <DeleteUserModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}