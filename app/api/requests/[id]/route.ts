import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/requests/[id] — update status (accept/reject/cancel/complete)
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
    const allowed = ["pending", "accepted", "rejected", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    // Cek request ada dan user terlibat
    const { data: existing } = await supabase
      .from("learning_requests")
      .select("learner_id, mentor_id, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }

    const isLearner = existing.learner_id === user.id;
    const isMentor = existing.mentor_id === user.id;

    if (!isLearner && !isMentor) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Aturan: hanya mentor yang bisa accept/reject, hanya learner yang bisa cancel
    if ((status === "accepted" || status === "rejected") && !isMentor) {
      return NextResponse.json({ error: "Hanya mentor yang bisa accept/reject" }, { status: 403 });
    }
    if (status === "cancelled" && !isLearner) {
      return NextResponse.json({ error: "Hanya learner yang bisa cancel" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("learning_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ request: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
