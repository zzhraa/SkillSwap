import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/users/[id] — profil user tertentu
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        email,
        role,
        department,
        avatar_url,
        bio,
        created_at,
        skills (
          id,
          name,
          level,
          description,
          categories ( id, name, icon_emoji )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/users/[id] — update profil sendiri
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    if (user.id !== id) {
      return NextResponse.json({ error: "Tidak diizinkan mengubah profil orang lain" }, { status: 403 });
    }

    const { name, department, bio, avatarUrl } = await request.json();

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (department !== undefined) updates.department = department;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
