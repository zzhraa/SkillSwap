import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/skills?categoryId=xxx&search=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    const supabase = await createClient();

    let query = supabase
      .from("skills")
      .select(`
        id,
        name,
        level,
        description,
        created_at,
        category_id,
        categories ( id, name, icon_emoji ),
        profiles ( id, name, department, avatar_url )
      `)
      .order("created_at", { ascending: false });

    if (categoryId) query = query.eq("category_id", categoryId);
    if (userId) query = query.eq("user_id", userId);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ skills: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/skills — tambah skill baru (harus login)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { name, level, categoryId, description } = await request.json();

    if (!name || !level) {
      return NextResponse.json({ error: "Nama dan level skill wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: user.id,
        name,
        level,
        category_id: categoryId ?? null,
        description: description ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ skill: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
