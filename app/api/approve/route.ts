import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    id,
    full_name,
    country,
    application_number
  } = body;

  await supabaseAdmin
    .from("applications")
    .update({
      status: "Одобрено"
    })
    .eq("id", id);

  await supabaseAdmin
    .from("admin_logs")
    .insert([
      {
        action: "Одобрено",
        application_id: id,
        application_number,
        full_name
      }
    ]);

  await supabaseAdmin
    .from("citizens")
    .insert([
      {
        application_id: id,
        full_name,
        country,
        citizen_number: `НЧ-${String(id).padStart(6, "0")}`,
        status: "active"
      }
    ]);

  return NextResponse.json({
    success: true
  });
}