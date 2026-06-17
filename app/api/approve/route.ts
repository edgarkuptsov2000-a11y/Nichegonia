import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

  await supabaseAdmin.from("admin_logs").insert([
    {
      action: "Одобрено",
      application_id: id,
      application_number: application.application_number,
      full_name: application.full_name
    }
  ]);

  const { data: existingCitizen } = await supabaseAdmin
    .from("citizens")
    .select("id")
    .eq("application_id", id)
    .maybeSingle();

  if (!existingCitizen) {
    const citizenNumber =
      application.application_number || `НЧ-${String(id).padStart(6, "0")}`;

    const { count } = await supabaseAdmin
      .from("citizens")
      .select("*", {
        count: "exact",
        head: true
      });

    let title: string | null = null;

    if ((count ?? 0) < 10) {
      title = "Ничегошка Первого Созыва";
    }

    const { error: citizenError } = await supabaseAdmin.from("citizens").insert([
      {
        application_id: id,
        full_name: application.full_name,
        country: application.country,
        application_number: application.application_number,
        citizen_number: citizenNumber,
        status: "active",
        title
      }
    ]);

    if (citizenError) {
      return NextResponse.json(
        { error: "Заявка одобрена, но гражданин не создан" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true
  });
}
