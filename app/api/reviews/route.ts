import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reviews?requestId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");

    const supabase = await createClient();

    let query = supabase
      .from("reviews")
      .select("id, rating, review, created_at, request_id")
      .order("created_at", { ascending: false });

    if (requestId) query = query.eq("request_id", requestId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ reviews: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { requestId, rating, review } = await request.json();

    if (!requestId || !rating) {
      return NextResponse.json({ error: "requestId dan rating wajib diisi" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1-5" }, { status: 400 });
    }

    // Pastikan request statusnya completed dan user adalah sender
    const { data: req } = await supabase
      .from("requests")
      .select("status, sender_id")
      .eq("id", requestId)
      .single();

    if (!req) return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    if (req.sender_id !== user.id) {
      return NextResponse.json({ error: "Hanya learner yang bisa memberi review" }, { status: 403 });
    }
    if (req.status !== "completed") {
      return NextResponse.json({ error: "Sesi belum selesai" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({ request_id: requestId, rating, review: review ?? null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
