import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/requests/[id]
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

    const { status } = await request.json();
    const allowed = ["pending", "accepted", "rejected", "completed"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("requests")
      .select("sender_id, receiver_id, status")
      .eq("id", id)
      .single();

    if (!existing) return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });

    const isSender = existing.sender_id === user.id;
    const isReceiver = existing.receiver_id === user.id;

    if (!isSender && !isReceiver) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Hanya receiver yang bisa accept/reject, hanya sender yang bisa cancel (set ke pending kembali)
    if ((status === "accepted" || status === "rejected") && !isReceiver) {
      return NextResponse.json({ error: "Hanya penerima request yang bisa accept/reject" }, { status: 403 });
    }
    if (status === "completed" && !isReceiver) {
      return NextResponse.json({ error: "Hanya penerima yang bisa menyelesaikan sesi" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Kalau accepted, otomatis buat chat_room
    if (status === "accepted") {
      const { error: chatError } = await supabase
        .from("chat_rooms")
        .insert({ request_id: id })
        .select()
        .single();
        
      if (chatError) {
        // Balikin ke pending aja kalau gagal bikin room
        await supabase.from("requests").update({ status: "pending" }).eq("id", id);
        return NextResponse.json({ error: `Gagal membuat room chat: ${chatError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ request: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
