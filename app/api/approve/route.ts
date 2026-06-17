import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createCitizenForApprovedApplication } from "@/lib/citizenship";

export async function POST(req: Request) {
  const body = await req.json();

  const id = Number(body?.id);

  if (!id) {
    return NextResponse.json(
      { error: "Некорректный id заявки" },
      { status: 400 }
    );
  }

  const { data: application, error: applicationError } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !application) {
    return NextResponse.json(
      { error: "Заявка не найдена" },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      status: "Одобрено",
      approved_at: new Date().toISOString()
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Не удалось одобрить заявку" },
      { status: 500 }
    );
  }

  try {
    const citizen = await createCitizenForApprovedApplication(application);

    await supabaseAdmin.from("admin_logs").insert([
      {
        action: "Одобрено",
        application_id: id,
        application_number: citizen.citizen_number,
        full_name: application.full_name
      }
    ]);
  } catch (citizenError) {
    console.log("CITIZEN CREATE ERROR:", citizenError);

    return NextResponse.json(
      { error: "Заявка одобрена, но гражданин не создан" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true
  });
}
