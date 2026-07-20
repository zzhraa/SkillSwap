import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    // 1. Cari request ID dimana user terlibat (sebagai sender atau receiver)
    const { data: userRequests } = await supabase
      .from("requests")
      .select("id")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!userRequests || userRequests.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const requestIds = userRequests.map((r) => r.id);

    // 2. Load chat rooms berdasarkan request ID tersebut, lengkap dengan pesan terakhir dan info user
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        id, created_at,
        messages ( message, created_at ),
        requests (
          id, status, message,
          sender:users!requests_sender_id_fkey ( id, name, avatar ),
          receiver:users!requests_receiver_id_fkey ( id, name, avatar ),
          skills ( id, title )
        )
      `)
      .in("request_id", requestIds);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ conversations: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
