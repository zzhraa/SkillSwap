import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Cek apakah user sedang login
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    // Update password di Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password berhasil diubah" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
