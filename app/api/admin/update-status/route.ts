import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(request: NextRequest) {
  const adminCookie = request.cookies.get("admin_auth")?.value;
  return adminCookie === process.env.ADMIN_SESSION_SECRET;
}

const allowedStatuses = ["На рассмотрении", "Одобрено", "Отклонено"];

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);

  const id = Number(body?.id);
  const status = String(body?.status || "");

  if (!id || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Некорректные данные" },
      { status: 400 }
    );
  }

  const { data: application, error: applicationError } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !application) {
    console.log("APPLICATION FIND ERROR:", applicationError);

    return NextResponse.json(
      { error: "Заявка не найдена" },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      status,
      approved_at: status === "Одобрено" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (updateError) {
    console.log("APPLICATION UPDATE ERROR:", updateError);

    return NextResponse.json(
      { error: "Не удалось обновить статус" },
      { status: 500 }
    );
  }

  const { error: logError } = await supabaseAdmin
    .from("admin_logs")
    .insert([
      {
        action: status,
        application_id: id,
        application_number: application.application_number,
        full_name: application.full_name
      }
    ]);

  if (logError) {
    console.log("ADMIN LOG INSERT ERROR:", logError);
  }

  if (status === "Одобрено") {
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

      const { error: citizenError } = await supabaseAdmin
        .from("citizens")
        .insert([
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
        console.log("CITIZEN INSERT ERROR:", citizenError);
      }
    }
  }

  return NextResponse.json({
    ok: true
  });
}