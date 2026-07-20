import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations/[id]/messages
export async function GET(
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

    // Cek akses: user harus sender atau receiver dari request terkait room ini
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("id, requests ( sender_id, receiver_id )")
      .eq("id", id)
      .single();

    // const req = room?.requests as { sender_id: string; receiver_id: string } | null;
    const req = Array.isArray(room?.requests)
      ? room.requests[0]
      : room?.requests;
    if (!room || !req || (req.sender_id !== user.id && req.receiver_id !== user.id)) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("messages")
      .select(`
        id, message, created_at,
        sender:users!messages_sender_id_fkey ( id, name, avatar )
      `)
      .eq("room_id", id)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ messages: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/conversations/[id]/messages
export async function POST(
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

    const { message } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // Cek akses
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("id, requests ( sender_id, receiver_id )")
      .eq("id", id)
      .single();

    // const req = room?.requests as { sender_id: string; receiver_id: string } | null;
    const req = Array.isArray(room?.requests)
      ? room.requests[0]
      : room?.requests;
    if (!room || !req || (req.sender_id !== user.id && req.receiver_id !== user.id)) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({ room_id: id, sender_id: user.id, message: message.trim() })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
