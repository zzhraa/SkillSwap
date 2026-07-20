import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase: null, error: "Tidak terautentikasi" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { supabase: null, error: "Akses ditolak" };
  return { supabase, error: null };
}

// GET /api/admin/stats
export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ error }, { status: error === "Tidak terautentikasi" ? 401 : 403 });
  }

  try {
    const [
      { count: totalUsers },
      { count: totalSkills },
      { count: totalRequests },
      { count: pendingRequests },
      { count: completedRequests },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("requests").select("*", { count: "exact", head: true }),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ]);

    return NextResponse.json({
      stats: { totalUsers, totalSkills, totalRequests, pendingRequests, completedRequests },
    });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
