import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error: "TELEGRAM_BOT_TOKEN не найден в .env.local"
        },
        { status: 500 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        {
          ok: false,
          error: "TELEGRAM_ADMIN_CHAT_ID не найден в .env.local"
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Тестовое сообщение от Администрации Ничегонии. Telegram-бот работает."
        })
      }
    );

    const result = await response.json();

    return NextResponse.json(
      {
        ok: response.ok,
        telegramStatus: response.status,
        telegramResult: result
      },
      {
        status: response.ok ? 200 : 500
      }
    );
  } catch (error) {
    console.log("TELEGRAM TEST ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Route упал",
        details: String(error)
      },
      { status: 500 }
    );
  }
}