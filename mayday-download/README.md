# Витрина Mayday

Русская версия доступна по `/`, английская по `/en/`. Заголовки, описания и карточки пересылки локализованы. Переключатель языка сохраняет раздел страницы и параметр `from=bankomet`. Он добавляет кнопку возврата к входу в Банкомёт. Переписка и бот на витрине демонстрационные.

20 ноября 2026 витрина опубликована на [mayday.colorchain.ru](https://mayday.colorchain.ru/) в отдельном проекте `a63909s-projects/mayday-showcase`. В REG.RU сохранён `CNAME mayday fd90281be95f1709.vercel-dns-017.com.`. Vercel подтвердил привязку и выпустил сертификат. По HTTPS на постоянном адресе проверены обе языковые версии, страница с параметром `from=bankomet` и Windows ZIP с совпадением SHA-256. Для распространения используйте `mayday.colorchain.ru`. В проверке с телефонов служебный адрес `mayday-showcase.vercel.app` давал сбои соединения.

В шапке и подвале стоит логотип Mayday. Шапка, первый экран, кнопки и плашки оформлены по первой версии витрины. Шрифты Manrope и Cormorant Garamond загружаются локально. Знаки платформ находятся в `dist/assets/platforms/`.

Тексты находятся в `src/copy.mjs`, общий шаблон в `src/template.html`, поведение страницы в `src/page.mjs`. Сборка включает стили из `dist/style.css`, иконки, шрифты, сценарий и настройки выпуска в оба HTML-файла. Для статического хостинга достаточно `dist/`. После изменения `dist/release.mjs` повторно запустите сборку, чтобы обновить ссылки в страницах.

```powershell
node website/mayday-download/build.mjs
python -m http.server 18764 --bind 127.0.0.1 --directory website/mayday-download/dist
```

## Сверка функций

| Что показано | Реализация или результат проверки |
| --- | --- |
| Mayday ID, QR и поиск по номеру по согласию | `MaydayProfileLink`, `MaydayContactDiscovery`, `docs/MAYDAY_PHONE_SEARCH_2026-11-14.md`. Регистрация требует SMS. |
| Локальная связь, несколько узлов доставки и шифрование личных сообщений | `MaydayLanTransport`, `MaydayGatewayClient`, `MaydayRelayRegistry`, `MessengerE2ECrypto`. Регистрация и ряд сервисов используют отдельные серверы. |
| Награды за подтверждённые исходящие сообщения | `CommunicationRewardRules`, `CommunicationRewardLedger`, `MaydayRewardClaimActivity`. Тестовое зачисление 3 LBU₽ подтверждено в блоке и кошельке, см. `docs/MAYDAY_COMMUNICATION_REWARDS_ACTIVATION_2026-11-19.md`. |
| Боты без кода, заявки с сайта и мини-приложения | `MaydayMyBotsActivity`, `MaydayBotTemplates`, `MaydayBotSitesActivity`, `MaydayMiniAppActivity`. |
| Чаты, канал с медиа, группа для себя, звонки, истории, профиль, кошелёк, игры и подтверждение входа | `MaydayGroupCreateActivity`, `MaydayChannelMedia`, `MaydayGroupCalls`, `MaydayStoryProtocol`, `MaydayProfileAlbum`, `MaydayReactions`, `MaydayGamesBot`, `MaydayWebSignInRequest` и документы дизайн-системы. |

## Загрузки и публикация

- **Windows x64.** Тестовый ZIP 0.2.2 лежит в `dist/releases/`. 295 096 байт. SHA-256 `3f067034c45572d3fb0e0cd8718199fe86d5da79d2d5a944cc2db70f23ad50cf`. Это десктопный клиент, подключаемый к телефону по QR. [Документация клиента](../../app/mayday-desktop/README.md).
- **Android.** После выбора подписанного STD для внешнего теста положить APK в `dist/releases/` или настроить этот путь на файловое хранилище. В `dist/release.mjs` заполнить `filename`, `version`, `bytes`, `sha256`. Текущий `null` скрывает кнопку. Проверить HTTPS, MIME `application/vnd.android.package-archive` и SHA скачанного файла.
- **Linux.** Готовой сборки нет. Текущий десктопный клиент использует WPF для Windows.
- **macOS.** После сборки отдельного клиента подписать приложение сертификатом Developer ID, заверить DMG в Apple и проверить запуск на Mac. Загрузить DMG по `dist/releases/mayday-macos-<версия>.dmg` или `mayday-macos-<universal|arm64|x64>-<версия>.dmg`. Заполнить `macRelease` в `dist/release.mjs` полями `filename`, `version`, `bytes`, `sha256`. Проверить скачивание и контрольную сумму. [Developer ID](https://developer.apple.com/developer-id/).
- **iPhone.** Проект `ios/ColorChainCompanion` поддерживает сборку без подписи. Для внешней беты подписать сборку, загрузить её в App Store Connect, пройти проверку TestFlight и проверить приглашение на iPhone. Указать проверенный адрес вида `https://testflight.apple.com/join/<код>` в `testFlightInvite`. [TestFlight](https://developer.apple.com/testflight/).
- Публичный адрес `https://mayday.colorchain.ru/`. Переход в действующем Банкомёте подключается после публикации проверенного Android APK. При выборе другого адреса обновить `SITE` в `build.mjs`, ссылки alternate/canonical в шаблоне и адрес в клиенте Банкомёта.

Android Intent открывает установленный пакет `com.example.tamarashadow.std` или страницу с `from=bankomet`. После установки «Вернуться в Банкомёт» открывает новый выбор входа. Android и Windows проверяются отдельными сценариями.

## Проверки

Сборка, в которой ресурсы приходят вместе с HTML, опубликована как `dpl_EzL5bFvUBucqzarAyXeCtLwTSuqf`. Диагностика Chrome на телефонах показала, что отдельные запросы за иконками и скриптом оставались незавершёнными в течение нескольких минут. Проверки `node website/mayday-download/build.mjs` и `node --check` для исходного сценария и совместимого модуля прошли. Обе языковые версии в браузере достигли состояния полной загрузки, все 24 изображения отобразились, переключение языка сохранило направление из Банкомёта, кнопка демо-бота сработала. Публичные страницы и Windows ZIP совпали с локальными файлами.

Версия со стилями внутри HTML опубликована как `dpl_6Ea4ahFkEWQy3ph2jneXXDtxpH7x`. Изменены сборщик, шаблон и два сгенерированных HTML-файла. `node mayday-download/build.mjs` и `node --check` для сборщика и сценария страницы прошли. На M12 и S21 через HTTPS полностью загружены страницы RU, EN, вход из Банкомёта и файл шрифта. Содержимое и Windows ZIP на основном домене совпадают с локальной сборкой.

Первое оформление с новыми шрифтами опубликовано как `dpl_4iLCsfS8LYcyfXT3nW6NAh3K1enB`. Обновлены `src/template.html`, `src/copy.mjs`, `dist/style.css` и сгенерированные страницы. Сборка и проверка синтаксиса прошли. В браузере проверены первый экран, узкая шапка, статусы платформ, демо-бот и переход с Банкомёта в английскую версию. Публичные страницы, стили, шрифты и Windows ZIP совпадают с локальными файлами.

Светлый первый экран опубликован как `dpl_4SpeMKhVfKTDVpLGxaqMZYSSZwL8`. Изменены `src/template.html`, `src/copy.mjs`, `dist/style.css` и сгенерированные страницы. Сборка и `node --check website/mayday-download/dist/page.mjs` прошли. Экран проверен в браузере при 320, 390 и 1440 пикселях. Обе публичные версии, стили и Windows ZIP совпадают с локальной сборкой.

Восстановленный шаблон опубликован как `dpl_Aup7PipAmyMNiH5SWkDhyEqqiQaG`. Изменены `src/template.html`, `src/copy.mjs`, `build.mjs`, `dist/style.css`, две карточки пересылки и сгенерированные страницы. Из публичного пакета убран логотип студии.

`node website/mayday-download/build.mjs` и проверка синтаксиса `node --check` для сборщика и сценария страницы прошли. В браузере проверены ширины 320, 390 и 1440 пикселей, переключение RU/EN с параметром Банкомёта и якорем платформы, ответы демо-бота. Обе публичные страницы, картинки пересылки, пять знаков платформ и архив Windows совпадают с локальной сборкой. SHA-256 скачанного ZIP совпадает с исходным.
