import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase: null, error: "Tidak terautentikasi" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { supabase: null, error: "Akses ditolak" };

  return { supabase, error: null };
}

// PATCH /api/admin/users/[id] — update role user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ error }, { status: error === "Tidak terautentikasi" ? 401 : 403 });
  }

  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    const { data, error: dbError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — hapus user
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ error }, { status: error === "Tidak terautentikasi" ? 401 : 403 });
  }

  try {
    const { id } = await params;

    const { error: dbError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
