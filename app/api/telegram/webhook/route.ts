import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  answerTelegramCallback,
  editTelegramMessage,
  sendTelegramMessage
} from "@/lib/telegram";

function isValidTelegramRequest(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  return request.headers.get("x-telegram-bot-api-secret-token") === secret;
}

function isAllowedTelegramUser(userId?: number) {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!adminChatId || !userId) {
    return false;
  }

  return String(userId) === String(adminChatId);
}

async function getApplication(id: number) {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log("TELEGRAM GET APPLICATION ERROR:", error);
    return null;
  }

  return data;
}

async function updateApplicationStatus(id: number, status: string) {
  const application = await getApplication(id);

  if (!application) {
    return {
      ok: false,
      error: "Заявка не найдена"
    };
  }

  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({
      status,
      approved_at: status === "Одобрено" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (updateError) {
    console.log("TELEGRAM UPDATE APPLICATION ERROR:", updateError);

    return {
      ok: false,
      error: "Не удалось изменить статус"
    };
  }

  await supabaseAdmin.from("admin_logs").insert([
    {
      action: status,
      application_id: id,
      application_number: application.application_number,
      full_name: application.full_name
    }
  ]);

  if (status === "Одобрено") {
    const { data: existingCitizen } = await supabaseAdmin
      .from("citizens")
      .select("id")
      .eq("application_id", id)
      .maybeSingle();

    if (!existingCitizen) {
      const citizenNumber =
        application.application_number || `НЧ-${String(id).padStart(6, "0")}`;

      await supabaseAdmin.from("citizens").insert([
        {
          application_id: id,
          full_name: application.full_name,
          country: application.country,
          citizen_number: citizenNumber,
          status: "active"
        }
      ]);
    }
  }

  return {
    ok: true,
    application
  };
}

function formatAnswers(answers: string | null) {
  if (!answers) {
    return "Ответы не найдены.";
  }

  try {
    const parsed = JSON.parse(answers);

    if (!Array.isArray(parsed)) {
      return "Ответы повреждены.";
    }

    return parsed
      .map((item, index) => {
        return `${index + 1}. ${item.question}\nОтвет: ${item.answer}`;
      })
      .join("\n\n");
  } catch {
    return "Ответы повреждены.";
  }
}

export async function POST(request: NextRequest) {
  if (!isValidTelegramRequest(request)) {
    return NextResponse.json(
      { error: "Invalid Telegram secret" },
      { status: 401 }
    );
  }

  const update = await request.json();

  const callbackQuery = update.callback_query;

  if (!callbackQuery) {
    return NextResponse.json({ ok: true });
  }

  const callbackQueryId = callbackQuery.id;
  const fromId = callbackQuery.from?.id;
  const message = callbackQuery.message;
  const callbackData = String(callbackQuery.data || "");

  if (!isAllowedTelegramUser(fromId)) {
    await answerTelegramCallback(
      callbackQueryId,
      "У вас нет доступа к управлению Ничегонией."
    );

    return NextResponse.json({ ok: true });
  }

  const [action, rawId] = callbackData.split(":");
  const id = Number(rawId);

  if (!id) {
    await answerTelegramCallback(callbackQueryId, "Некорректная заявка.");
    return NextResponse.json({ ok: true });
  }

  if (action === "details") {
    const application = await getApplication(id);

    if (!application) {
      await answerTelegramCallback(callbackQueryId, "Заявка не найдена.");
      return NextResponse.json({ ok: true });
    }

    const text = [
      "🔎 Подробности заявки",
      "",
      `👤 ФИО: ${application.full_name}`,
      `🎂 Возраст: ${application.age}`,
      `🌍 Страна: ${application.country}`,
      `🪪 Номер: ${application.application_number}`,
      `📌 Статус: ${application.status}`,
      "",
      `📝 Причина: ${application.reason}`,
      "",
      "Ответы:",
      formatAnswers(application.answers)
    ].join("\n");

    await sendTelegramMessage(text);
    await answerTelegramCallback(callbackQueryId, "Подробности отправлены.");

    return NextResponse.json({ ok: true });
  }

  if (action !== "approve" && action !== "reject") {
    await answerTelegramCallback(callbackQueryId, "Неизвестное действие.");
    return NextResponse.json({ ok: true });
  }

  const nextStatus = action === "approve" ? "Одобрено" : "Отклонено";

  const result = await updateApplicationStatus(id, nextStatus);

  if (!result.ok || !result.application) {
    await answerTelegramCallback(
      callbackQueryId,
      result.error || "Ошибка действия."
    );

    return NextResponse.json({ ok: true });
  }

  await answerTelegramCallback(
    callbackQueryId,
    action === "approve" ? "Заявка одобрена." : "Заявка отклонена."
  );

  if (message?.chat?.id && message?.message_id) {
    const updatedText = [
      action === "approve" ? "✅ Заявка одобрена" : "❌ Заявка отклонена",
      "",
      `👤 ФИО: ${result.application.full_name}`,
      `🌍 Страна: ${result.application.country}`,
      `🪪 Номер: ${result.application.application_number}`,
      "",
      "Действие выполнено через Telegram."
    ].join("\n");

    await editTelegramMessage(
      message.chat.id,
      message.message_id,
      updatedText,
      {
        inline_keyboard: [
          [
            {
              text: "🔎 Подробности",
              callback_data: `details:${id}`
            }
          ]
        ]
      }
    );
  }

  return NextResponse.json({ ok: true });
}
