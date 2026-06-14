type TelegramReplyMarkup = {
  inline_keyboard: Array<
    Array<
      | {
          text: string;
          callback_data: string;
        }
      | {
          text: string;
          url: string;
        }
    >
  >;
};

type NewApplicationForTelegram = {
  id: number;
  full_name: string;
  age: number;
  country: string;
  reason: string;
  application_number: string;
  photo_url?: string | null;
};

const telegramApiBase = "https://api.telegram.org/bot";

function getTelegramToken() {
  return process.env.TELEGRAM_BOT_TOKEN;
}

function getTelegramChatId() {
  return process.env.TELEGRAM_ADMIN_CHAT_ID;
}

function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ""
  ).replace(/\/$/, "");
}

async function callTelegram(method: string, payload: any) {
  const token = getTelegramToken();

  if (!token) {
    console.log("TELEGRAM_BOT_TOKEN is missing");
    return null;
  }

  const response = await fetch(`${telegramApiBase}${token}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.log("TELEGRAM API ERROR:", method, result);
  }

  return result;
}

export async function sendTelegramMessage(
  text: string,
  replyMarkup?: TelegramReplyMarkup
) {
  const chatId = getTelegramChatId();

  if (!chatId) {
    console.log("TELEGRAM_ADMIN_CHAT_ID is missing");
    return null;
  }

  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup
  });
}

export async function answerTelegramCallback(
  callbackQueryId: string,
  text: string
) {
  return callTelegram("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false
  });
}

export async function editTelegramMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: TelegramReplyMarkup
) {
  return callTelegram("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    reply_markup: replyMarkup
  });
}

export async function sendNewApplicationToTelegram(
  application: NewApplicationForTelegram
) {
  const siteUrl = getSiteUrl();

  const verifyUrl = siteUrl
    ? `${siteUrl}/verify?number=${encodeURIComponent(
        application.application_number
      )}`
    : "";

  const adminUrl = siteUrl ? `${siteUrl}/admin` : "";

  const text = [
    "🆕 Новая заявка на гражданство Ничегонии",
    "",
    `👤 ФИО: ${application.full_name}`,
    `🎂 Возраст: ${application.age}`,
    `🌍 Страна: ${application.country}`,
    `🪪 Номер заявки: ${application.application_number}`,
    "",
    `📝 Причина: ${application.reason}`,
    "",
    "Выберите действие:"
  ].join("\n");

  const keyboard: TelegramReplyMarkup["inline_keyboard"] = [
    [
      {
        text: "✅ Одобрить",
        callback_data: `approve:${application.id}`
      },
      {
        text: "❌ Отклонить",
        callback_data: `reject:${application.id}`
      }
    ],
    [
      {
        text: "🔎 Подробности",
        callback_data: `details:${application.id}`
      }
    ]
  ];

  const linkRow: TelegramReplyMarkup["inline_keyboard"][number] = [];

  if (verifyUrl) {
    linkRow.push({
      text: "Проверка",
      url: verifyUrl
    });
  }

  if (adminUrl) {
    linkRow.push({
      text: "Админка",
      url: adminUrl
    });
  }

  if (linkRow.length > 0) {
    keyboard.push(linkRow);
  }

  return sendTelegramMessage(text, {
    inline_keyboard: keyboard
  });
}
