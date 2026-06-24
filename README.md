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

Дополнительно, если используется email через SMTP:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@example.com
SMTP_PASS=your-app-password
SMTP_FROM="Кривые Линии <no-reply@example.com>"
LEAD_EMAIL_TO=owner@example.com
```

Примечания:

- `NEXT_PUBLIC_SITE_URL` используется для canonical, Open Graph, `sitemap.xml`, `robots.txt` и Schema.org.
- `LEAD_WEBHOOK_URL` опционален.
- `MAX_BOT_TOKEN` и `MAX_CHAT_ID` / `MAX_USER_ID` опциональны.
- для Яндекс Почты используйте пароль приложения, а не обычный пароль от почты.

## Отправка заявок на email

Основной канал доставки заявок: форма на сайте -> `POST /api/lead` -> SMTP -> письмо владельцу сайта.

SMTP-переменные задаются в Vercel: Project -> Settings -> Environment Variables. После добавления или изменения переменных нужно сделать Redeploy проекта.

Минимальный набор env для email-доставки:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@example.com
SMTP_PASS=your-app-password
SMTP_FROM="Кривые Линии <no-reply@example.com>"
LEAD_EMAIL_TO=owner@example.com
```

Назначение переменных:

- `SMTP_HOST` — SMTP-сервер.
- `SMTP_PORT` — порт, например `465` или `587`.
- `SMTP_SECURE` — `true` для `465`, `false` для `587`.
- `SMTP_USER` — логин почты.
- `SMTP_PASS` — пароль или app-password.
- `SMTP_FROM` — отправитель письма, например `Кривые Линии <no-reply@curvedlines.ru>`.
- `LEAD_EMAIL_TO` — адрес, куда отправлять заявки.

Webhook и MAX можно оставить пустыми. Если SMTP не настроен, `/api/lead` попробует использовать `LEAD_WEBHOOK_URL` или MAX как fallback.

Curl-тест production API на Windows:

```cmd
curl.exe -X POST https://curvedlines.ru/api/lead ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Тест\",\"phone\":\"+79999999999\",\"service\":\"Комплексный запрос\",\"message\":\"Проверка email-заявки\",\"page\":\"/\"}"
```

## Vercel + Cloudflare DNS fix

Канонический production-домен проекта: `https://curvedlines.ru`.

Настройки в Vercel:

- Project -> Settings -> Domains: выбрать `curvedlines.ru` как Primary.
- `www.curvedlines.ru` должен redirect на `curvedlines.ru`.
- В Environment Variables должно быть `NEXT_PUBLIC_SITE_URL=https://curvedlines.ru`.
- После изменения доменов и env сделать Redeploy в Vercel.

Настройки в Cloudflare DNS:

- Отключить proxy/orange cloud для `curvedlines.ru` и `www.curvedlines.ru`.
- Записи должны быть DNS only/gray cloud.
- Для apex-домена: `@ A 76.76.21.21`.
- Для `www`: `www CNAME cname.vercel-dns.com` или точное значение, которое показывает Vercel.

Проверка на Windows после изменений:

```powershell
curl.exe -I https://curvedlines.ru
curl.exe -I https://www.curvedlines.ru
curl.exe -I https://curvedlines.ru/sitemap.xml
curl.exe -I https://curvedlines.ru/robots.txt
nslookup curvedlines.ru
nslookup www.curvedlines.ru
```

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
