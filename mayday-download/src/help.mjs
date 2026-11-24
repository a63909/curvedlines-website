const miniAppExample = `<p id="status">Open this page from your bot chat in Mayday.</p>
<script>
  if (window.Mayday) {
    const status = document.querySelector('#status');
    Mayday.ready()
      .then(({ app }) => { status.textContent = app.name; })
      .catch(() => { status.textContent = 'Could not load Mayday.'; });
  }
</script>`;

const startPrivateGateway = `cd /opt/mayday
umask 077
mkdir -p private data
test -e private/entries.json || printf '[]\\n' > private/entries.json
npm ci --prefix app/mayday-gateway --omit=dev

MAYDAY_DATA_DIR="$PWD/data" \\
MAYDAY_PUBLIC_URL=https://relay.example.org \\
MAYDAY_PRIVATE_NODE=true \\
MAYDAY_PRIVATE_ENTRIES_FILE="$PWD/private/entries.json" \\
PORT=3188 node app/mayday-gateway/server.mjs`;

const privateHttpsConfig = `{
  "urls": ["https://relay.example.org"],
  "port": 443,
  "backendPort": 3188,
  "cert": "/path/to/fullchain.pem",
  "key": "/path/to/privkey.pem",
  "entriesFile": "/opt/mayday/private/entries.json",
  "privateOnly": true
}`;

const startPrivateHttps = 'node /opt/mayday/tools/mayday-gateway/direct-https.mjs /opt/mayday';

const issuePrivateInvitation = `node tools/mayday-gateway/issue-entry.mjs \\
  private/entries.json private/invite-01.txt \\
  https://relay.example.org '<MAYDAY_ID>' 'Backup relay'`;

export const help = {
  ru: {
    title: 'Справка Mayday',
    summary: 'Первые шаги в Mayday, подключение к сети и документация по мини-приложениям.',
    home: 'На сайт Mayday',
    navigation: 'Разделы справки',
    contents: 'На этой странице',
    download: 'Загрузки Mayday',
    user: 'Пользователям',
    developer: 'Разработчикам и администраторам',
    topics: [
      {
        slug: 'getting-started', icon: 'download', group: 'user',
        title: 'Первые шаги',
        summary: 'Как установить Mayday на Android, найти собеседника и подключить компьютер.',
        sections: [
          {
            id: 'android', title: 'Установить на Android',
            steps: [
              'Скачайте APK для Android с сайта Mayday и откройте файл.',
              'Если Android попросит разрешение на установку из источника, с которого вы открыли файл, разрешите установку и вернитесь к APK.',
              'Откройте Mayday, выберите страну, укажите номер и подтвердите его кодом из SMS.'
            ],
            links: [['#install', 'Скачать Mayday']]
          },
          {
            id: 'find', title: 'Найти человека',
            paragraphs: [
              'Если вам прислали ссылку на профиль Mayday, откройте её и перейдите в приложение. Можно также отсканировать QR-код профиля в Mayday.',
              'Поиск по номеру работает для подтверждённых номеров, если владелец аккаунта разрешил находить себя по номеру. Если результата нет, попросите ссылку на профиль.'
            ]
          },
          {
            id: 'windows', title: 'Подключить Mayday для Windows',
            steps: [
              'Установите и запустите Mayday для Windows. На компьютере появится QR-код.',
              'В Mayday на телефоне откройте «Настройки → Устройства → Подключить компьютер».',
              'Отсканируйте QR-код, сверьте цифры на обоих экранах и подтвердите подключение.'
            ],
            links: [['#windows', 'Скачать Mayday для Windows']]
          }
        ]
      },
      {
        slug: 'network', icon: 'globe', group: 'user',
        title: 'Сеть Mayday',
        summary: 'Как Mayday подключается, где взять ссылку-приглашение и что означают статусы узлов.',
        sections: [
          {
            id: 'automatic', title: 'Нужна ли мне ссылка-приглашение?',
            paragraphs: [
              'Для обычной работы достаточно открыть Mayday. Приложение подключается автоматически. Поле «Код приглашения» можно оставить пустым.',
              'Ссылка-приглашение нужна, если администратор узла решил дать вашему аккаунту доступ к дополнительному подключению через непубличный узел.'
            ]
          },
          {
            id: 'invitation', title: 'Где взять ссылку-приглашение?',
            paragraphs: [
              'Ссылку выдаёт администратор узла для вашего аккаунта. Откройте «Мой профиль», нажмите «Копировать» под Mayday ID и пришлите этот ID администратору. Он выпустит и пришлёт вам ссылку.',
              'У ссылки есть срок действия. Если она просрочилась, попросите администратора выдать новую.'
            ],
            links: [['help/relay-operator/', 'Как создать свой узел и выпустить ссылку']]
          },
          {
            id: 'add', title: 'Как добавить резервный узел',
            steps: [
              'Откройте присланную ссылку в Mayday. Если приложение не открылось, перейдите в «Настройки → Сеть Mayday» и вставьте ссылку целиком в поле «Код приглашения».',
              'Нажмите «Добавить узел». Узел появится в списке, а Mayday попробует подключиться.',
              'Проверьте статус карточки узла. При ошибке убедитесь, что ссылка скопирована целиком и вы вошли в аккаунт, для которого её выдали.'
            ]
          },
          {
            id: 'status', title: 'Что означают статусы',
            paragraphs: [
              '«Подключён» означает, что Mayday сейчас на связи с узлом. «Подключаемся при доступности» означает, что соединение ещё не установлено. «Выключен» означает, что узел отключён переключателем.',
              '«Подключено устройств рядом: 0» относится к прямым локальным подключениям. Если у основного узла стоит «Подключён», связь через него уже работает.'
            ]
          }
        ]
      },
      {
        slug: 'relay-operator', icon: 'shield', group: 'developer',
        title: 'Как создать свой узел Mayday',
        summary: 'Запуск непубличного шлюза на своём сервере и выдача ссылки для конкретного Mayday ID.',
        sections: [
          {
            id: 'requirements', title: 'Что понадобится',
            paragraphs: [
              'Узел в разделе «Сеть Mayday» — это серверный шлюз мессенджера. Чтобы запустить свой, нужен компьютер или VPS, к которому телефон сможет подключиться по HTTPS, доменное имя и действующий TLS-сертификат для этого имени.',
              'Пример ниже рассчитан на Linux-сервер с Node.js 22.20.0 или новее и доступом к исходникам Mayday. Поместите исходники в /opt/mayday или замените этот путь во всех командах. Замените relay.example.org своим доменом, который указывает на сервер. Если шлюз уже настроен, переходите к выдаче ссылки.'
            ]
          },
          {
            id: 'gateway', title: 'Запустите шлюз Mayday',
            paragraphs: [
              'Установите зависимости и запустите шлюз в непубличном режиме. Он слушает только локальный адрес 127.0.0.1:3188. Файл private/entries.json хранит выданные приглашения, поэтому сохраняйте его при обновлении.'
            ],
            code: startPrivateGateway
          },
          {
            id: 'https', title: 'Настройте вход по HTTPS',
            paragraphs: [
              'Сохраните пример как /opt/mayday/private/direct.json. Укажите пути к своему сертификату и ключу. Оба процесса должны читать один и тот же private/entries.json. Для подключения из интернета откройте входящий TCP-порт 443.'
            ],
            code: privateHttpsConfig
          },
          {
            id: 'start-https', title: 'Запустите HTTPS-процесс',
            paragraphs: [
              'Оставьте шлюз запущенным и выполните команду в другом терминале. Учётной записи процесса нужен доступ к ключу и право слушать порт 443. Для постоянной работы настройте запуск обоих процессов как служб.'
            ],
            code: startPrivateHttps
          },
          {
            id: 'issue', title: 'Выпустите ссылку для аккаунта',
            paragraphs: [
              'В Mayday откройте «Мой профиль» нужного аккаунта и нажмите «Копировать» под Mayday ID. В команде укажите этот ID целиком, свой HTTPS-домен и имя узла, которое увидит получатель. Выполните команду из каталога с исходниками Mayday.',
              'Готовая ссылка начинается с mayday://entry# и появится в файле private/invite-01.txt. Отправьте содержимое файла только владельцу указанного аккаунта. Ссылка действует 90 дней. Для каждого следующего приглашения указывайте новое имя выходного файла.'
            ],
            code: issuePrivateInvitation
          },
          {
            id: 'check', title: 'Проверьте подключение с телефона',
            steps: [
              'Войдите в аккаунт, для которого выпущена ссылка. В разделе «Настройки → Сеть Mayday» вставьте ссылку целиком и нажмите «Добавить узел».',
              'Выключите Wi-Fi на телефоне и проверьте, что через мобильный интернет у нового узла появился статус «Подключён».'
            ],
            links: [['help/network/#add', 'Инструкция для получателя ссылки']]
          }
        ]
      },
      {
        slug: 'mini-apps', icon: 'bot', group: 'developer',
        title: 'Мини-приложения',
        summary: 'Как открыть сайт внутри Mayday, настроить разрешения и получить контекст в JavaScript.',
        sections: [
          {
            id: 'connect', title: 'Подключить сайт к боту',
            steps: [
              'Подготовьте веб-страницу с публичным HTTPS-адресом.',
              'В Mayday для Android откройте «Сервисы → Боты → Мои боты». Выберите «Мини-приложение» у нужного бота или создайте бота для своего сайта.',
              'Укажите название и HTTPS-адрес. Сохраните настройки и откройте приложение кнопкой в чате бота.'
            ]
          },
          {
            id: 'sdk', title: 'Получить контекст Mayday',
            paragraphs: ['Mayday для Android добавляет объект window.Mayday при открытии мини-приложения. Вызов Mayday.ready() возвращает контекст, включая настройки языка и темы, сведения о приложении и боте. Пример ниже показывает название приложения, а в обычном браузере оставляет подсказку.'],
            code: miniAppExample
          },
          {
            id: 'permissions', title: 'Профиль и отправка данных',
            paragraphs: [
              'Mayday.requestAuth({ challenge }) запрашивает вход и публичный профиль с согласия пользователя. Для этого включите разрешение «Вход и профиль» в настройках мини-приложения.',
              'Mayday.sendData(data) позволяет отправить боту строку или данные в формате JSON размером до 4096 байт после сериализации. Для этого включите «Данные для этого бота». Пользователь подтверждает каждую отправку.'
            ]
          }
        ]
      }
    ]
  },
  en: {
    title: 'Mayday Help',
    summary: 'Get started with Mayday, learn how it connects, and build mini apps.',
    home: 'Mayday website',
    navigation: 'Help topics',
    contents: 'On this page',
    download: 'Mayday downloads',
    user: 'For users',
    developer: 'For developers and administrators',
    topics: [
      {
        slug: 'getting-started', icon: 'download', group: 'user',
        title: 'Getting started',
        summary: 'Install Mayday on Android, find someone, and link your computer.',
        sections: [
          {
            id: 'android', title: 'Install on Android',
            steps: [
              'Download the Android APK from the Mayday website and open the file.',
              'If Android asks for permission to install apps from the source you opened the file with, grant it and return to the APK.',
              'Open Mayday, choose your country, enter your number, and verify it with the SMS code.'
            ],
            links: [['#install', 'Download Mayday']]
          },
          {
            id: 'find', title: 'Find someone',
            paragraphs: [
              'If someone sends you a Mayday profile link, open it and continue in the app. You can also scan their profile QR code in Mayday.',
              'Phone-number search works for verified numbers when the account owner allows people to find them by number. If you get no results, ask for a profile link.'
            ]
          },
          {
            id: 'windows', title: 'Link Mayday for Windows',
            steps: [
              'Install and open Mayday for Windows. A QR code appears on the computer.',
              'In Mayday on your phone, go to Settings → Devices → Connect a computer.',
              'Scan the QR code, check that the digits match on both screens, and confirm the connection.'
            ],
            links: [['#windows', 'Download Mayday for Windows']]
          }
        ]
      },
      {
        slug: 'network', icon: 'globe', group: 'user',
        title: 'Mayday network',
        summary: 'See how Mayday connects, where to get an invitation, and what relay statuses mean.',
        sections: [
          {
            id: 'automatic', title: 'Do I need an invitation link?',
            paragraphs: [
              'Open Mayday to connect automatically. You can leave the invitation field empty for everyday use.',
              'You need an invitation link if a relay administrator grants your account access to an additional connection through a private relay.'
            ]
          },
          {
            id: 'invitation', title: 'Where do I get an invitation link?',
            paragraphs: [
              'The relay administrator issues the link for your account. Open My profile, tap Copy below Mayday ID, and send that ID to the administrator. They will create the invitation and send it to you.',
              'Invitation links expire. Ask the administrator for a fresh link if yours has expired.'
            ],
            links: [['help/relay-operator/', 'Set up your own relay and issue an invitation']]
          },
          {
            id: 'add', title: 'Add a backup relay',
            steps: [
              'Open the invitation link in Mayday. If the app does not open, go to Settings → Mayday network and paste the full link into the Invitation code field.',
              'Tap Add node. It appears in the list and Mayday tries to connect.',
              'Check the status on the relay card. If you see an error, make sure you copied the whole link and signed in with the account it was issued for.'
            ]
          },
          {
            id: 'status', title: 'Understand relay statuses',
            paragraphs: [
              'Connected means Mayday has a connection to the relay. Connecting when available means Mayday has yet to connect. Disabled means the relay was turned off with its switch.',
              'A count of zero nearby devices refers to direct local connections. If Main node shows Connected, that connection is working.'
            ]
          }
        ]
      },
      {
        slug: 'relay-operator', icon: 'shield', group: 'developer',
        title: 'Host your own Mayday relay',
        summary: 'Run a private gateway on your server and issue an invitation for a specific Mayday ID.',
        sections: [
          {
            id: 'requirements', title: 'What you need',
            paragraphs: [
              'A relay in the Mayday network settings is a messaging gateway. To run one, you’ll need a computer or VPS that your phone can reach over HTTPS, a domain name, and a valid TLS certificate for that name.',
              'This example uses a Linux server with Node.js 22.20.0 or later and access to the Mayday source code. Place the source in /opt/mayday or adapt the paths throughout. Replace relay.example.org with your own domain pointing to the server. If your gateway is already set up, skip to issuing an invitation.'
            ]
          },
          {
            id: 'gateway', title: 'Start the Mayday gateway',
            paragraphs: [
              'Install the dependencies and run the gateway in private mode. It listens only on the local address 127.0.0.1:3188. The private/entries.json file stores issued invitations. Keep it when you update the gateway.'
            ],
            code: startPrivateGateway
          },
          {
            id: 'https', title: 'Configure the HTTPS entry point',
            paragraphs: [
              'Save this example as /opt/mayday/private/direct.json. Set the paths to your own certificate and key. Both processes must read the same private/entries.json file. Allow inbound TCP connections on port 443 for access over the internet.'
            ],
            code: privateHttpsConfig
          },
          {
            id: 'start-https', title: 'Start the HTTPS process',
            paragraphs: [
              'Leave the gateway running and run this command in another terminal. The process needs permission to read the key and listen on port 443. For a permanent setup, run both processes as services.'
            ],
            code: startPrivateHttps
          },
          {
            id: 'issue', title: 'Issue a link for an account',
            paragraphs: [
              'Open My profile in the target Mayday account and tap Copy under Mayday ID. Use the full ID, your HTTPS domain, and the relay name the recipient will see. Run the command from the Mayday source directory.',
              'The link starts with mayday://entry# and is written to private/invite-01.txt. Send the contents only to the owner of that account. The link is valid for 90 days. Choose a new output filename for each invitation.'
            ],
            code: issuePrivateInvitation
          },
          {
            id: 'check', title: 'Check the connection from a phone',
            steps: [
              'Sign in to the account the link was issued for. In Settings → Mayday network, paste the complete link and tap Add node.',
              'Turn off Wi-Fi on the phone and check that the new relay shows Connected over mobile data.'
            ],
            links: [['help/network/#add', 'Instructions for the invitation recipient']]
          }
        ]
      },
      {
        slug: 'mini-apps', icon: 'bot', group: 'developer',
        title: 'Mini apps',
        summary: 'Open a website inside Mayday, configure permissions, and read context in JavaScript.',
        sections: [
          {
            id: 'connect', title: 'Connect a website to a bot',
            steps: [
              'Prepare a page with a public HTTPS address.',
              'In Mayday for Android, go to Services → Bots → My bots. Choose Mini app for an existing bot or create a bot for your website.',
              'Enter a name and HTTPS address. Save your settings and use the mini app button in the bot chat to open it.'
            ]
          },
          {
            id: 'sdk', title: 'Read the Mayday context',
            paragraphs: ['Mayday for Android provides window.Mayday when it opens your mini app. Mayday.ready() returns context, including the user interface language and theme, the app, and the bot. This example displays the mini app name and leaves a hint in a regular browser.'],
            code: miniAppExample
          },
          {
            id: 'permissions', title: 'Profile and data permissions',
            paragraphs: [
              'Mayday.requestAuth({ challenge }) requests sign-in and access to the public profile with the user’s consent. Enable the Sign in and profile permission in your mini app settings.',
              'Mayday.sendData(data) sends a string or JSON data of up to 4096 bytes after serialization. Enable Data for this bot. The user confirms each submission.'
            ]
          }
        ]
      }
    ]
  }
};
