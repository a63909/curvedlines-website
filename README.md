# Curved Lines Site

Next.js 16 App Router сайт для услуг:

- ремонт квартир
- реставрация ванн
- сварочные работы

Основной production-домен: `https://curvedlines.ru`

## Технологии

- Next.js 16 App Router
- route handlers / API routes
- metadata, canonical и Open Graph
- `sitemap.ts` и `robots.ts`
- JSON-LD `LocalBusiness`
- форма заявки с отправкой через `POST /api/lead`

## Страницы

- `/`
- `/remont-kvartir-moskva`
- `/restavraciya-vann-moskva`
- `/svarochnye-raboty-moskva`
- `/ceni`
- `/kontakty`

## Локальный запуск

```bash
npm install
npm run dev
```

Проверка production-сборки:

```bash
npm run lint
npm run build
```

## Переменные окружения

Минимально для production:

```bash
NEXT_PUBLIC_SITE_URL=https://curvedlines.ru
```

Дополнительно, если используется внешний webhook:

```bash
LEAD_WEBHOOK_URL=https://your-webhook-endpoint.example
```

Дополнительно, если используется MAX:

```bash
MAX_BOT_TOKEN=your-max-bot-token
MAX_CHAT_ID=123456789
MAX_USER_ID=
```

Дополнительно, если используется email через Яндекс SMTP:

```bash
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=a639091@yandex.ru
SMTP_PASS=your-yandex-app-password
SMTP_FROM=a639091@yandex.ru
LEAD_EMAIL_TO=a639091@yandex.ru
```

Примечания:

- `NEXT_PUBLIC_SITE_URL` используется для canonical, Open Graph, `sitemap.xml`, `robots.txt` и Schema.org.
- `LEAD_WEBHOOK_URL` опционален.
- `MAX_BOT_TOKEN` и `MAX_CHAT_ID` / `MAX_USER_ID` опциональны.
- для Яндекс Почты используйте пароль приложения, а не обычный пароль от почты.

## Деплой на Netlify Free

### Если сайт в отдельном репозитории

Настройки в Netlify:

- Build command: `npm run build`
- Publish directory: не задавайте вручную
- Base directory: не нужен

Environment variables:

```bash
NEXT_PUBLIC_SITE_URL=https://curvedlines.ru
```

При необходимости добавьте:

- `LEAD_WEBHOOK_URL`
- `MAX_BOT_TOKEN`
- `MAX_CHAT_ID`
- `MAX_USER_ID`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `LEAD_EMAIL_TO`

### Если сайт лежит в репозитории `TamaraShadow`

Настройки в Netlify:

- Base directory: `website`
- Build command: `npm run build`
- Publish directory: не задавайте вручную

Environment variables:

```bash
NEXT_PUBLIC_SITE_URL=https://curvedlines.ru
```

При необходимости добавьте те же дополнительные переменные:

- `LEAD_WEBHOOK_URL`
- `MAX_BOT_TOKEN`
- `MAX_CHAT_ID`
- `MAX_USER_ID`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `LEAD_EMAIL_TO`

## Netlify notes

- Проект использует App Router и route handlers, поэтому API route `POST /api/lead` должен деплоиться как серверная функцию Netlify.
- `netlify.toml` уже добавлен и задает `npm run build`.
- Домен `https://curvedlines.ru` используется как production fallback даже если `NEXT_PUBLIC_SITE_URL` случайно не задан.
