import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, icon")
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ categories: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
