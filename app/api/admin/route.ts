import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdmin(request: NextRequest) {
  const adminCookie = request.cookies.get("admin_auth")?.value;
  return adminCookie === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("ADMIN APPLICATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    applications: data || []
  });
}