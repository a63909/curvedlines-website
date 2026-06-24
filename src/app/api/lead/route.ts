import nodemailer from "nodemailer";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  service?: string;
  workType?: string;
  message?: string;
  comment?: string;
  page?: string;
  [key: string]: unknown;
};

type NormalizedLead = {
  name: string;
  phone: string;
  service: string;
  workType: string;
  comment: string;
  message: string;
  page: string;
  createdAt: string;
  source: string;
};

type DeliveryChannel = "email" | "webhook" | "max" | "none";

type DeliveryError = {
  channel: DeliveryChannel;
  message: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

type MaxConfig = {
  apiBase: string;
  token: string;
  chatId?: string;
  userId?: string;
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

function sanitizeSensitiveText(value: string) {
  const secrets = [
    process.env.SMTP_PASS,
    process.env.SMTP_USER,
    process.env.MAX_BOT_TOKEN,
    process.env.MAX_API_BASE,
    process.env.LEAD_WEBHOOK_URL,
  ].filter((secret): secret is string => Boolean(secret));

  return secrets.reduce(
    (text, secret) => text.split(secret).join("[redacted]"),
    value,
  );
}

function formatLeadDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Moscow",
  }).format(date);
}

function formatLeadMessage(payload: NormalizedLead) {
  const lines = [
    "Новая заявка с сайта",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.service}`,
    `Комментарий: ${payload.comment || "—"}`,
    `Страница: ${payload.page || "—"}`,
    `Дата/время: ${payload.createdAt}`,
  ];

  return lines.join("\n");
}

function formatMaxLeadMessage(payload: NormalizedLead) {
  const lines = [
    "Новая заявка с сайта curvedlines.ru",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.service}`,
    `Комментарий: ${payload.comment || "—"}`,
    `Страница: ${payload.page || "—"}`,
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
    ["Услуга", payload.service],
    ["Комментарий", payload.comment || "—"],
    ["Страница", payload.page || "—"],
    ["Дата/время", payload.createdAt],
  ];

  const items = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 14px;border:1px solid #e7dfd5;font-weight:600;background:#faf6f1;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:10px 14px;border:1px solid #e7dfd5;vertical-align:top;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#1f1a16;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:22px;">Новая заявка с сайта</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;background:#fff;">
        ${items}
      </table>
    </div>
  `;
}

function getSafeErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  return sanitizeSensitiveText(truncateErrorText(error.message || fallback));
}

function getSafeErrorCode(error: unknown) {
  if (!(error instanceof Error) || !("code" in error)) {
    return "";
  }

  const code = (error as { code?: unknown }).code;

  return typeof code === "string" ? sanitizeSensitiveText(code) : "";
}

function logLeadDelivery(channel: DeliveryChannel, result: "success" | "fail") {
  console.info(`lead delivery channel: ${channel} result: ${result}`);
}

function logLeadDeliveryFinal(result: "success" | "fail") {
  console.info(`lead delivery final result: ${result}`);
}

function getSmtpConfig(): { config?: SmtpConfig; missing: string[] } {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPortRaw = process.env.SMTP_PORT?.trim();
  const smtpSecureRaw = process.env.SMTP_SECURE?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpFrom = process.env.SMTP_FROM?.trim();
  const leadEmailTo = process.env.LEAD_EMAIL_TO?.trim();

  const requiredEnv: Array<[string, string | undefined]> = [
    ["SMTP_HOST", smtpHost],
    ["SMTP_PORT", smtpPortRaw],
    ["SMTP_SECURE", smtpSecureRaw],
    ["SMTP_USER", smtpUser],
    ["SMTP_PASS", smtpPass],
    ["SMTP_FROM", smtpFrom],
    ["LEAD_EMAIL_TO", leadEmailTo],
  ];
  const missing = requiredEnv
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    return { missing };
  }

  const port = Number(smtpPortRaw);

  if (!Number.isInteger(port) || port <= 0) {
    return { missing: ["SMTP_PORT"] };
  }

  return {
    config: {
      host: smtpHost!,
      port,
      secure: smtpSecureRaw?.toLowerCase() === "true",
      user: smtpUser!,
      pass: smtpPass!,
      from: smtpFrom!,
      to: leadEmailTo!,
    },
    missing: [],
  };
}

function getMaxConfig(): { config?: MaxConfig; error?: DeliveryError } {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  const chatId = process.env.MAX_CHAT_ID?.trim();
  const userId = process.env.MAX_USER_ID?.trim();

  if (!token) {
    return {};
  }

  if (!chatId && !userId) {
    return {
      error: {
        channel: "max",
        message: "Указан MAX_BOT_TOKEN, но не указан MAX_CHAT_ID или MAX_USER_ID.",
      },
    };
  }

  return {
    config: {
      apiBase: (process.env.MAX_API_BASE?.trim() || "https://platform-api.max.ru").replace(/\/+$/, ""),
      token,
      chatId: chatId || undefined,
      userId: userId || undefined,
    },
  };
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

async function sendLeadToMax(config: MaxConfig, message: string) {
  const params = new URLSearchParams();

  if (config.chatId) {
    params.set("chat_id", config.chatId);
  } else if (config.userId) {
    params.set("user_id", config.userId);
  } else {
    throw new Error("Не указан MAX_CHAT_ID или MAX_USER_ID.");
  }

  const maxResponse = await fetch(
    `${config.apiBase}/messages?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: config.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
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
async function sendLeadEmail(payload: NormalizedLead, config: SmtpConfig) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject: "Новая заявка с сайта curvedlines.ru",
    text: formatLeadMessage(payload),
    html: formatLeadHtml(payload),
  });
}

function deliveryErrorMessage(errors: DeliveryError[], smtpMissing: string[]) {
  if (process.env.NODE_ENV !== "production" && errors.length > 0) {
    return `Заявка не дошла до приемника. Канал доставки: ${errors[0].channel}. Ошибка: ${errors[0].message}`;
  }

  if (process.env.NODE_ENV !== "production" && smtpMissing.length > 0) {
    return `Заявка не дошла до приемника. Не заданы SMTP env: ${smtpMissing.join(", ")}.`;
  }

  return "Заявка не дошла до приемника. Проверьте настройки доставки заявок и попробуйте снова.";
}
export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return Response.json(
      { message: "Передайте данные заявки в формате JSON." },
      { status: 400 },
    );
  }

  const name = cleanText(body.name);
  const phone = normalizePhone(cleanText(body.phone));
  const service = cleanText(body.service) || cleanText(body.workType);
  const comment = cleanText(body.message) || cleanText(body.comment);
  const page = cleanText(body.page);

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

  if (service.length < 3) {
    return Response.json(
      { message: "Выберите вид работ, чтобы мы правильно обработали заявку." },
      { status: 400 },
    );
  }

  const payload: NormalizedLead = {
    name,
    phone,
    service,
    workType: service,
    comment,
    message: comment,
    page,
    createdAt: formatLeadDate(new Date()),
    source: "website-form",
  };

  const { config: smtpConfig, missing: smtpMissing } = getSmtpConfig();
  const { config: maxConfig, error: maxConfigError } = getMaxConfig();
  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  const deliveryErrors: DeliveryError[] = [];
  const successMessage =
    "Заявка отправлена. Мы свяжемся с вами, чтобы уточнить детали работ.";
  let delivered = false;
  let configuredChannels = 0;

  if (smtpConfig) {
    configuredChannels += 1;

    try {
      await sendLeadEmail(payload, smtpConfig);
      delivered = true;
      logLeadDelivery("email", "success");
    } catch (error) {
      const safeErrorMessage = getSafeErrorMessage(
        error,
        "Email delivery failed.",
      );
      const safeErrorCode = getSafeErrorCode(error);

      logLeadDelivery("email", "fail");
      deliveryErrors.push({
        channel: "email",
        message: safeErrorMessage,
      });

      console.error(
        `lead delivery channel: email result: fail error code: ${safeErrorCode || "none"} message: ${safeErrorMessage}`,
      );
    }
  }

  if (maxConfig) {
    configuredChannels += 1;

    try {
      await sendLeadToMax(maxConfig, formatMaxLeadMessage(payload));
      delivered = true;
      logLeadDelivery("max", "success");
    } catch (error) {
      const safeErrorMessage = getSafeErrorMessage(
        error,
        "MAX delivery failed.",
      );
      const safeErrorCode = getSafeErrorCode(error);

      logLeadDelivery("max", "fail");
      deliveryErrors.push({
        channel: "max",
        message: safeErrorMessage,
      });

      console.error(
        `lead delivery channel: max result: fail error code: ${safeErrorCode || "none"} message: ${safeErrorMessage}`,
      );
    }
  } else if (maxConfigError) {
    configuredChannels += 1;
    logLeadDelivery("max", "fail");
    deliveryErrors.push(maxConfigError);
  }

  if (!delivered && webhookUrl) {
    configuredChannels += 1;

    try {
      await sendLeadWebhook(webhookUrl, payload);
      delivered = true;
      logLeadDelivery("webhook", "success");
    } catch (error) {
      logLeadDelivery("webhook", "fail");
      deliveryErrors.push({
        channel: "webhook",
        message: getSafeErrorMessage(error, "Webhook delivery failed."),
      });
    }
  }

  if (delivered) {
    logLeadDeliveryFinal("success");

    return Response.json({
      message: successMessage,
    });
  }

  if (configuredChannels === 0) {
    logLeadDelivery("none", "fail");
  }

  logLeadDeliveryFinal("fail");

  return Response.json(
    { message: deliveryErrorMessage(deliveryErrors, smtpMissing) },
    { status: 502 },
  );
}