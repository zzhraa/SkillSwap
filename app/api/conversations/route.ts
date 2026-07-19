import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations — list semua conversation milik user
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        last_message,
        last_message_at,
        created_at,
        user1:profiles!conversations_user1_id_fkey ( id, name, avatar_url ),
        user2:profiles!conversations_user2_id_fkey ( id, name, avatar_url )
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ conversations: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/conversations — mulai conversation baru (atau return yang sudah ada)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json({ error: "otherUserId wajib diisi" }, { status: 400 });
    }
    if (otherUserId === user.id) {
      return NextResponse.json({ error: "Tidak bisa chat dengan diri sendiri" }, { status: 400 });
    }

    // Pastikan urutan konsisten: user1_id < user2_id (hindari duplikat)
    const [user1Id, user2Id] = [user.id, otherUserId].sort();

    // Cek apakah sudah ada conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("user1_id", user1Id)
      .eq("user2_id", user2Id)
      .single();

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    // Buat conversation baru
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user1_id: user1Id, user2_id: user2Id })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ conversation: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
