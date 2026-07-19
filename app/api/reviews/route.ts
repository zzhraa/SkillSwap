import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reviews?mentorId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get("mentorId");

    const supabase = await createClient();

    let query = supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:profiles!reviews_reviewer_id_fkey ( id, name, avatar_url ),
        mentor:profiles!reviews_mentor_id_fkey ( id, name )
      `)
      .order("created_at", { ascending: false });

    if (mentorId) query = query.eq("mentor_id", mentorId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ reviews: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/reviews — submit review setelah sesi selesai
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { requestId, mentorId, rating, comment } = await request.json();

    if (!requestId || !mentorId || !rating) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1-5" }, { status: 400 });
    }

    // Pastikan request ini statusnya "completed" dan milik user ini
    const { data: req } = await supabase
      .from("learning_requests")
      .select("status, learner_id")
      .eq("id", requestId)
      .single();

    if (!req) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }
    if (req.learner_id !== user.id) {
      return NextResponse.json({ error: "Hanya learner yang bisa memberi review" }, { status: 403 });
    }
    if (req.status !== "completed") {
      return NextResponse.json({ error: "Sesi belum selesai" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        request_id: requestId,
        reviewer_id: user.id,
        mentor_id: mentorId,
        rating,
        comment: comment ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
