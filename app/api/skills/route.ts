import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/skills?categoryId=xxx&search=xxx&userId=xxx
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
        id, title, level, description, created_at, category_id,
        categories ( id, name, icon ),
        users ( id, name, bio, avatar )
      `)
      .order("created_at", { ascending: false });

    if (categoryId) query = query.eq("category_id", categoryId);
    if (userId) query = query.eq("user_id", userId);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ skills: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/skills
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { title, level, categoryId, description } = await request.json();

    if (!title || !level) {
      return NextResponse.json({ error: "Judul dan level skill wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: user.id,
        title,
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
