import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role, bio, avatar")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json({ message: "Login berhasil", user: profile });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
