import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/skills/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { data: skill } = await supabase
      .from("skills")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!skill) return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
    if (skill.user_id !== user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Skill berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/skills/[id]
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

    const { data: skill } = await supabase
      .from("skills")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!skill) return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
    if (skill.user_id !== user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const { title, level, categoryId, description } = await request.json();
    const updates: Record<string, string | null> = {};
    if (title !== undefined) updates.title = title;
    if (level !== undefined) updates.level = level;
    if (categoryId !== undefined) updates.category_id = categoryId;
    if (description !== undefined) updates.description = description;

    const { data, error } = await supabase
      .from("skills")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ skill: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
