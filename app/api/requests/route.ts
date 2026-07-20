import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/requests
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("requests")
      .select(`
        id, message, status, created_at,
        skills ( id, title, level ),
        sender:users!requests_sender_id_fkey ( id, name, avatar ),
        receiver:users!requests_receiver_id_fkey ( id, name, avatar )
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ requests: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/requests
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { receiverId, skillId, message } = await request.json();

    if (!receiverId || !skillId) {
      return NextResponse.json({ error: "receiverId dan skillId wajib diisi" }, { status: 400 });
    }
    if (user.id === receiverId) {
      return NextResponse.json({ error: "Tidak bisa request ke diri sendiri" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("requests")
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        skill_id: skillId,
        message: message ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ request: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
