import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendNewApplicationToTelegram } from "@/lib/telegram";
import { getNextApplicationNumber } from "@/lib/citizenship";

export const runtime = "nodejs";

function generateAccessCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const fullName = String(formData.get("fullName") || "").trim();
  const age = Number(formData.get("age") || 0);
  const birthDate = String(formData.get("birthDate") || "").trim();
  const sex = String(formData.get("sex") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const reason = String(formData.get("reason") || "").trim();
  const answers = String(formData.get("answers") || "[]");
  const photo = formData.get("photo");

  if (
  !fullName ||
  !age ||
  !country ||
  !reason ||
  !birthDate ||
  !sex ||
  !["Мужской", "Женский"].includes(sex)
) {
  return NextResponse.json(
    { error: "Заполните все поля анкеты корректно." },
    { status: 400 }
  );
}

const parsedBirthDate = new Date(`${birthDate}T00:00:00`);

if (
  Number.isNaN(parsedBirthDate.getTime()) ||
  parsedBirthDate.toISOString().slice(0, 10) !== birthDate ||
  birthDate > new Date().toISOString().slice(0, 10)
) {
  return NextResponse.json(
    { error: "Указана некорректная дата рождения." },
    { status: 400 }
  );
}
  

  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    const fileExt = photo.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.floor(
      Math.random() * 100000
    )}.${fileExt}`;

    const filePath = `applications/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("passport-photos")
      .upload(filePath, photo, {
        contentType: photo.type || "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      console.log("PHOTO UPLOAD ERROR:", uploadError);

      return NextResponse.json(
        { error: "Не удалось загрузить фото." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("passport-photos")
      .getPublicUrl(filePath);

    photoUrl = publicUrlData.publicUrl;
  }

  const accessCode = generateAccessCode();

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("applications")
    .insert([
      {
        full_name: fullName,
        age,
        birth_date: birthDate,
        sex,
        country,
        reason,
        answers,
        status: "На рассмотрении",
        access_code: accessCode,
        photo_url: photoUrl
      }
    ])
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.log("APPLICATION INSERT ERROR:", insertError);

    return NextResponse.json(
      { error: "Не удалось создать заявку." },
      { status: 500 }
    );
  }

  const applicationNumber = await getNextApplicationNumber(inserted.id);

  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      application_number: applicationNumber
    })
    .eq("id", inserted.id);

  if (updateError) {
    console.log("APPLICATION NUMBER UPDATE ERROR:", updateError);

    return NextResponse.json(
      { error: "Заявка создана, но номер не присвоен." },
      { status: 500 }
    );
  }

  try {
    const telegramResult = await sendNewApplicationToTelegram({
      id: inserted.id,
      full_name: fullName,
      age,
      country,
      reason,
      application_number: applicationNumber,
      photo_url: photoUrl
    });

    console.log("TELEGRAM NOTIFY RESULT:", telegramResult);
  } catch (telegramError) {
    console.log("TELEGRAM NOTIFY ERROR:", telegramError);
  }

  return NextResponse.json({
    applicationNumber,
    accessCode
  });
}
