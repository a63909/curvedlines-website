import nodemailer from "nodemailer";

type LeadPayload = {
  name?: string;
  phone?: string;
  workType?: string;
  comment?: string;
};

type NormalizedLead = {
  name: string;
  phone: string;
  workType: string;
  comment: string;
  createdAt: string;
  source: string;
};

function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function truncateErrorText(value: string) {
  return value.trim().slice(0, 300);
}

function formatLeadMessage(payload: NormalizedLead) {
  const lines = [
    "Новая заявка с сайта",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Вид работ: ${payload.workType}`,
    `Комментарий: ${payload.comment || "—"}`,
    `Источник: ${payload.source}`,
    `Время: ${payload.createdAt}`,
  ];

  return lines.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatLeadHtml(payload: NormalizedLead) {
  const rows = [
    ["Имя", payload.name],
    ["Телефон", payload.phone],
    ["Вид работ", payload.workType],
    ["Комментарий", payload.comment || "—"],
    ["Источник", payload.source],
    ["Время", payload.createdAt],
  ];

  const items = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 14px;border:1px solid #e7dfd5;font-weight:600;background:#faf6f1;">${escapeHtml(label)}</td><td style="padding:10px 14px;border:1px solid #e7dfd5;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#1f1a16;">
      <h2 style="margin:0 0 16px;">Новая заявка с сайта</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;background:#fff;">
        ${items}
      </table>
    </div>
  `;
}

async function sendLeadWebhook(url: string, payload: NormalizedLead) {
  const webhookResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!webhookResponse.ok) {
    const responseText = truncateErrorText(await webhookResponse.text());

    throw new Error(
      responseText
        ? `Webhook ${webhookResponse.status}: ${responseText}`
        : `Webhook ${webhookResponse.status}`,
    );
  }
}

async function sendLeadToMax({
  token,
  chatId,
  userId,
  message,
}: {
  token: string;
  chatId?: string;
  userId?: string;
  message: string;
}) {
  const params = new URLSearchParams();

  if (chatId) {
    params.set("chat_id", chatId);
  } else if (userId) {
    params.set("user_id", userId);
  } else {
    throw new Error("Не указан MAX_CHAT_ID или MAX_USER_ID.");
  }

  const maxResponse = await fetch(
    `https://platform-api.max.ru/messages?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
        notify: true,
      }),
      cache: "no-store",
    },
  );

  if (!maxResponse.ok) {
    const responseText = truncateErrorText(await maxResponse.text());

    throw new Error(
      responseText
        ? `MAX ${maxResponse.status}: ${responseText}`
        : `MAX ${maxResponse.status}`,
    );
  }
}

async function sendLeadEmail({
  payload,
  host,
  port,
  secure,
  user,
  pass,
  to,
  from,
}: {
  payload: NormalizedLead;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: `Новая заявка: ${payload.workType} — ${payload.phone}`,
    text: formatLeadMessage(payload),
    html: formatLeadHtml(payload),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as LeadPayload;

  const name = cleanText(body.name);
  const phone = normalizePhone(cleanText(body.phone));
  const workType = cleanText(body.workType);
  const comment = cleanText(body.comment);

  if (name.length < 2) {
    return Response.json(
      { message: "Укажите имя, чтобы мы могли к вам обратиться." },
      { status: 400 },
    );
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return Response.json(
      { message: "Укажите корректный телефон для обратной связи." },
      { status: 400 },
    );
  }

  if (workType.length < 3) {
    return Response.json(
      { message: "Выберите вид работ, чтобы мы правильно обработали заявку." },
      { status: 400 },
    );
  }

  const payload: NormalizedLead = {
    name,
    phone,
    workType,
    comment,
    createdAt: new Date().toISOString(),
    source: "website-form",
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  const maxBotToken = process.env.MAX_BOT_TOKEN?.trim();
  const maxChatId = process.env.MAX_CHAT_ID?.trim();
  const maxUserId = process.env.MAX_USER_ID?.trim();
  const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.yandex.ru";
  const smtpPort = Number(process.env.SMTP_PORT?.trim() || "465");
  const smtpSecure = (process.env.SMTP_SECURE?.trim() || "true") !== "false";
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const leadEmailTo = process.env.LEAD_EMAIL_TO?.trim() || "a639091@yandex.ru";
  const smtpFrom =
    process.env.SMTP_FROM?.trim() || smtpUser || "a639091@yandex.ru";
  const deliveryErrors: string[] = [];
  let deliveredSomewhere = false;

  if (webhookUrl) {
    try {
      await sendLeadWebhook(webhookUrl, payload);
      deliveredSomewhere = true;
    } catch (error) {
      deliveryErrors.push(
        error instanceof Error ? error.message : "Webhook delivery failed.",
      );
    }
  }

  if (maxBotToken && (maxChatId || maxUserId)) {
    try {
      await sendLeadToMax({
        token: maxBotToken,
        chatId: maxChatId,
        userId: maxUserId,
        message: formatLeadMessage(payload),
      });
      deliveredSomewhere = true;
    } catch (error) {
      deliveryErrors.push(
        error instanceof Error ? error.message : "MAX delivery failed.",
      );
    }
  } else if (maxBotToken && !maxChatId && !maxUserId) {
    deliveryErrors.push("Указан MAX_BOT_TOKEN, но не указан MAX_CHAT_ID или MAX_USER_ID.");
  }

  if (smtpUser && smtpPass && leadEmailTo) {
    try {
      await sendLeadEmail({
        payload,
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        user: smtpUser,
        pass: smtpPass,
        to: leadEmailTo,
        from: smtpFrom,
      });
      deliveredSomewhere = true;
    } catch (error) {
      deliveryErrors.push(
        error instanceof Error ? error.message : "Email delivery failed.",
      );
    }
  } else if (smtpUser && !smtpPass) {
    deliveryErrors.push("Указан SMTP_USER, но не указан SMTP_PASS.");
  }

  if (!webhookUrl && !maxBotToken && !smtpUser) {
    console.info("[lead-request]", payload);
  }

  if (!deliveredSomewhere && deliveryErrors.length > 0) {
    console.error("[lead-request:delivery-errors]", deliveryErrors);

    return Response.json(
      {
        message:
          "Заявка не дошла до приемника. Проверьте настройки webhook или MAX и попробуйте снова.",
      },
      { status: 502 },
    );
  }

  if (deliveryErrors.length > 0) {
    console.warn("[lead-request:partial-delivery]", deliveryErrors);
  }

  return Response.json({
    message:
      "Заявка отправлена. Мы свяжемся с вами, чтобы уточнить детали работ.",
  });
}
