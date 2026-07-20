import { NextRequest, NextResponse } from "next/server";
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

// GET /api/admin/users
export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ error }, { status: error === "Tidak terautentikasi" ? 401 : 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error: dbError } = await query;
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ users: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
