import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/requests — list request milik user yang login
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("learning_requests")
      .select(`
        id,
        mode,
        proposed_date,
        proposed_time,
        location,
        message,
        status,
        created_at,
        skills ( id, name, level ),
        learner:profiles!learning_requests_learner_id_fkey ( id, name, department, avatar_url ),
        mentor:profiles!learning_requests_mentor_id_fkey ( id, name, department, avatar_url )
      `)
      .or(`learner_id.eq.${user.id},mentor_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ requests: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/requests — buat request baru
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { mentorId, skillId, mode, proposedDate, proposedTime, location, message } =
      await request.json();

    if (!mentorId || !skillId || !mode || !proposedDate || !proposedTime) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    if (user.id === mentorId) {
      return NextResponse.json(
        { error: "Tidak bisa request ke diri sendiri" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("learning_requests")
      .insert({
        learner_id: user.id,
        mentor_id: mentorId,
        skill_id: skillId,
        mode,
        proposed_date: proposedDate,
        proposed_time: proposedTime,
        location: location ?? null,
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
