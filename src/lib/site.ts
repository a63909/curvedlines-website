import type { Metadata } from "next";

export const SITE = {
  brandName: "Кривые Линии Design",
  businessName:
    "Ремонт квартир, реставрация ванн и сварочные работы в Москве и МО",
  legalName: "ИП Гладышев Андрей Иванович",
  description:
    "Ремонт квартир под ключ, реставрация ванн жидким акрилом и литьевым мрамором, а также сварочные работы в Москве и Московской области.",
  aboutDescription:
    "Занимаемся ремонтом квартир, реставрацией ванн и сварочными работами в Москве и Московской области. Работаем аккуратно, соблюдаем договоренности по срокам и доводим каждую задачу до готового результата.",
  phoneDisplay: "+7 (982) 221-92-69",
  phoneHref: "tel:+79822219269",
  whatsappHref: "https://api.whatsapp.com/send?phone=79822219269",
  whatsappLabel: "Написать в WhatsApp",
  region: "Москва и Московская область",
  hoursLabel: "Ежедневно с 09:00 до 21:00",
  ogAlt: "Ремонт квартир, реставрация ванн и сварочные работы",
};

export const NAV_LINKS = [
  { label: "Услуги", href: "/#services" },
  { label: "Преимущества", href: "/#advantages" },
  { label: "Этапы", href: "/#steps" },
  { label: "Наши работы", href: "/#projects" },
  { label: "Стоимость работ", href: "/#pricing" },
  { label: "Контакты", href: "/#contacts" },
];

export const SERVICE_OPTIONS = [
  "Ремонт квартиры",
  "Реставрация ванны",
  "Сварочные работы",
  "Комплексный запрос",
];

export const SERVICES = [
  {
    title: "Ремонт квартир",
    description:
      "Комплексный ремонт под ключ с использованием современных материалов и технологий.",
    bullets: [
      "Косметический и капитальный ремонт",
      "Ремонт под ключ и отдельных помещений",
      "Работаем по договору и фиксированной смете",
    ],
    href: "/remont-kvartir-moskva",
    image: "/images/optimized/repair-type-1.webp",
  },
  {
    title: "Реставрация ванн",
    description:
      "Восстановление ванн жидким акрилом и литьевым мрамором для продления срока службы и улучшения внешнего вида.",
    bullets: [
      "Жидкий акрил и литьевой мрамор",
      "Снятие старого слоя и шпаклевка сколов",
      "Установка сифона и бордюрной ленты",
    ],
    href: "/restavraciya-vann-moskva",
    image: "/images/optimized/work-14.webp",
  },
  {
    title: "Сварочные работы",
    description:
      "Изготовление и монтаж металлоконструкций с высоким качеством и точностью.",
    bullets: [
      "Сварочные работы любой сложности",
      "Изготовление и монтаж по размерам объекта",
      "Надежные конструкции для дома и участка",
    ],
    href: "/svarochnye-raboty-moskva",
    image: "/images/optimized/welding-hero-realistic.webp",
  },
];

export const REPAIR_TYPES = [
  {
    title: "Косметический ремонт",
    description: "Обновление интерьера с минимальными изменениями планировки.",
  },
  {
    title: "Капитальный ремонт",
    description: "Полная перепланировка и обновление всех элементов квартиры.",
  },
  {
    title: "Ремонт «под ключ»",
    description: "Комплексный ремонт с полным оформлением интерьера.",
  },
  {
    title: "Ремонт отдельных помещений",
    description: "Ремонт конкретной комнаты или зоны по вашему выбору.",
  },
  {
    title: "Ремонт с перепланировкой",
    description:
      "Изменение планировки квартиры с проведением всех необходимых работ.",
  },
  {
    title: "Дизайнерский ремонт",
    description:
      "Ремонт с разработкой индивидуального дизайна помещения.",
  },
];

export const BATH_METHODS = [
  {
    title: "Жидкий акрил",
    description:
      "Ровное белое покрытие без демонтажа ванны, которое возвращает чаше аккуратный свежий вид.",
  },
  {
    title: "Литьевой мрамор",
    description:
      "Плотное восстановительное покрытие для более сложных дефектов, сколов и заметного износа.",
  },
];

export const BATH_EXTRAS = [
  "Снятие старого слоя",
  "Демонтаж чугунного слива",
  "Установка сифона",
  "Шпаклевка сколов",
  "Установка бордюрной ленты",
  "Аккуратная подготовка поверхности без грязи и резкого запаха",
];

export const WELDING_WORKS = [
  {
    title: "Лестницы и перила",
    description: "Изготовление и монтаж надежных лестничных конструкций.",
  },
  {
    title: "Навесы и козырьки",
    description: "Сварка каркасов под входные группы, парковки и зоны отдыха.",
  },
  {
    title: "Ворота и калитки",
    description: "Конструкции для частных домов, дач и хозяйственных участков.",
  },
  {
    title: "Ограждения и решетки",
    description: "Практичные металлические изделия под размеры объекта.",
  },
  {
    title: "Каркасы и усиления",
    description: "Усиление узлов и изготовление вспомогательных металлоконструкций.",
  },
  {
    title: "Локальная сварка",
    description: "Устранение дефектов, ремонт и доработка существующих элементов.",
  },
];

export const ADVANTAGES = [
  {
    title: "Работа по договору",
    description:
      "Заключаем договор, чтобы объем работ, сроки и стоимость были зафиксированы заранее.",
    icon: "/images/tilda/icon-check.svg",
  },
  {
    title: "Фиксированная смета",
    description:
      "Предоставляем полную смету до начала работ, исключая непредвиденные расходы.",
    icon: "/images/tilda/icon-check.svg",
  },
  {
    title: "Поэтапная оплата",
    description:
      "Возможность оплаты работ по этапам, что обеспечивает контроль за расходованием средств.",
    icon: "/images/tilda/icon-check.svg",
  },
  {
    title: "Аккуратные мастера",
    description:
      "Наши мастера отличаются высоким профессионализмом и аккуратностью в работе.",
    icon: "/images/tilda/icon-check.svg",
  },
  {
    title: "Гарантия на работы",
    description:
      "Предоставляем гарантию на выполненные работы, подтверждая качество результата.",
    icon: "/images/tilda/icon-check.svg",
  },
  {
    title: "Работа по Москве и области",
    description:
      "Оказываем услуги по ремонту и реставрации в Москве и Московской области.",
    icon: "/images/tilda/icon-check.svg",
  },
];

export const STEPS = [
  {
    title: "Заявка или звонок",
    description:
      "Вы оставляете заявку на сайте или пишете в мессенджер, чтобы быстро обсудить задачу.",
    icon: "/images/tilda/icon-phone.svg",
  },
  {
    title: "Выезд и оценка",
    description:
      "Приезжаем на объект, смотрим объем работ, консультируем и предлагаем решения.",
    icon: "/images/tilda/icon-courier.svg",
  },
  {
    title: "Смета и договор",
    description:
      "Согласуем смету, сроки и условия, после чего фиксируем все договором.",
    icon: "/images/tilda/icon-estimate.svg",
  },
  {
    title: "Сдача объекта",
    description:
      "Выполняем работы в оговоренные сроки, сдаем результат и передаем гарантию.",
    icon: "/images/tilda/icon-guarantee.svg",
  },
];

export const PROJECTS = [
  {
    title: "Гостиная с мягкой светлой палитрой",
    category: "Ремонт квартиры",
    term: "Под ключ",
    summary:
      "Интерьер в теплых нейтральных тонах с аккуратной отделкой, ровной геометрией и современной мебелью.",
    image: "/images/optimized/repair-type-1.webp",
  },
  {
    title: "Светлая комната после обновления",
    category: "Косметический ремонт",
    term: "Быстрый запуск",
    summary:
      "Чистовая отделка и визуально легкое пространство без перегруза деталями.",
    image: "/images/optimized/repair-type-2.webp",
  },
  {
    title: "Уютная зона отдыха",
    category: "Отдельное помещение",
    term: "Локальный ремонт",
    summary:
      "Комфортная небольшая комната с мягким светом, чистыми стенами и спокойной мебельной композицией.",
    image: "/images/optimized/repair-type-3.webp",
  },
  {
    title: "Современный интерьер с подсветкой",
    category: "Дизайнерский ремонт",
    term: "Премиум-подача",
    summary:
      "Сложная декоративная стена, скрытый свет и аккуратная работа с фактурами.",
    image: "/images/optimized/work-13.webp",
  },
  {
    title: "Реставрация ванны жидким акрилом",
    category: "Реставрация ванн",
    term: "Без демонтажа",
    summary:
      "Ровное наливное покрытие и аккуратная обработка сложных участков чаши.",
    image: "/images/optimized/work-14.webp",
  },
  {
    title: "Сварочные работы на объекте",
    category: "Сварка и металл",
    term: "По размерам",
    summary:
      "Надежные конструкции и точная подгонка под задачи заказчика.",
    image: "/images/optimized/welding-hero-realistic.webp",
  },
];

export const CERTIFICATES = [
  "/images/optimized/work-01.webp",
  "/images/optimized/work-02.webp",
  "/images/optimized/work-03.webp",
  "/images/optimized/work-04.webp",
  "/images/optimized/work-05.webp",
];

export const PRICING = [
  {
    title: "Ремонт квартиры",
    price: "Цена договорная",
    description: "Комплексный ремонт квартир любой сложности.",
    factors: [
      "Демонтаж, черновая и чистовая отделка",
      "Инженерные работы, плитка, стены и потолки",
      "Смета составляется после выезда и осмотра объекта",
    ],
  },
  {
    title: "Реставрация ванн",
    price: "Цена договорная",
    description: "Восстановление первоначального вида ванн.",
    factors: [
      "Снятие старого покрытия и подготовка поверхности",
      "Шпаклевка, покраска и установка комплектующих",
      "Работы подбираются по состоянию чаши",
    ],
  },
  {
    title: "Сварочные работы",
    price: "Цена договорная",
    description: "Сварочные работы любой сложности.",
    factors: [
      "Подготовка и сварка металлических конструкций",
      "Устранение дефектов и локальные усиления",
      "Стоимость зависит от размеров и сложности проекта",
    ],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Сколько времени займёт ремонт квартиры?",
    answer:
      "Срок ремонта зависит от объёма и сложности работ. До начала ремонта заранее согласуем график и порядок выполнения работ.",
  },
  {
    question: "Вы работаете по договору?",
    answer:
      "Да, мы работаем по договору, который защищает интересы обеих сторон и включает в себя все условия сотрудничества.",
  },
  {
    question: "Материалы ваши или мои?",
    answer:
      "Работаем по-разному: можем закупать материалы сами или работать с тем, что закупаете вы. Обсуждаем это на этапе сметы.",
  },
  {
    question: "Можно ли получить предварительную оценку по фото?",
    answer:
      "Да. Особенно удобно для реставрации ванн и части сварочных задач. По фото и короткому описанию дадим ориентир до выезда.",
  },
  {
    question: "Работаете ли вы по Москве и области?",
    answer:
      "Да, выезжаем по Москве и Московской области. Уточнить доступность выезда по вашему адресу можно по телефону или в WhatsApp.",
  },
];

export const SERVICE_AREAS = [
  "Москва",
  "Химки",
  "Красногорск",
  "Мытищи",
  "Балашиха",
  "Люберцы",
  "Одинцово",
  "Королев",
];

export const APARTMENT_FEATURES = [
  {
    title: "Комплексный подход",
    description:
      "Берем на себя ремонт квартиры целиком или отдельных помещений, в зависимости от вашей задачи.",
  },
  {
    title: "Современные материалы",
    description:
      "Используем решения, которые дают аккуратный результат и понятный срок службы.",
  },
  {
    title: "Смета до старта",
    description:
      "Подробно обсуждаем объем работ и формируем прозрачный расчет перед запуском.",
  },
  {
    title: "Для жизни и аренды",
    description:
      "Подбираем формат отделки под постоянное проживание, аренду или быстрое обновление.",
  },
];

export const BATH_FEATURES = [
  {
    title: "Без замены ванны",
    description:
      "Во многих случаях можно обновить чашу без демонтажа, строительного мусора и лишних затрат.",
  },
  {
    title: "Аккуратная подготовка",
    description:
      "Снимаем старый слой, устраняем дефекты и подготавливаем поверхность под новое покрытие.",
  },
  {
    title: "Работа по технологии",
    description:
      "Подбираем жидкий акрил или литьевой мрамор в зависимости от состояния ванны.",
  },
  {
    title: "Чистый результат",
    description:
      "Обновленная ванна выглядит опрятно, без грубых швов и визуального ощущения временного решения.",
  },
];

export const WELDING_FEATURES = [
  {
    title: "Работа по размерам",
    description:
      "Снимаем размеры на объекте и собираем конструкцию под ваши реальные задачи.",
  },
  {
    title: "Изготовление и монтаж",
    description:
      "Берем не только сварку, но и установку готового изделия на месте.",
  },
  {
    title: "Частные объекты",
    description:
      "Работаем с домами, дачами, дворами, входными группами и хозяйственными зонами.",
  },
  {
    title: "Прозрачный расчет",
    description:
      "Объясняем, из чего складывается цена: металл, изготовление, доставка и монтаж.",
  },
];

export const PRICE_FACTORS = [
  {
    title: "Объём работ",
    description:
      "Итоговая стоимость зависит от площади, количества операций и общего состава задач.",
  },
  {
    title: "Сложность объекта",
    description:
      "На цену влияют геометрия помещения, скрытые дефекты, доступ и дополнительные этапы подготовки.",
  },
  {
    title: "Материалы",
    description:
      "Чистовые материалы, металл, комплектующие и расходники рассчитываются под конкретный проект.",
  },
  {
    title: "Сроки и логистика",
    description:
      "Срочный выезд, доставка, подъем и монтаж в стесненных условиях тоже влияют на итоговую смету.",
  },
];

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  rawSiteUrl && rawSiteUrl.length > 0
    ? rawSiteUrl.replace(/\/+$/, "")
    : "https://curvedlines.ru";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
}: MetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ru_RU",
      siteName: SITE.brandName,
      url: absoluteUrl(path),
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: SITE.ogAlt,
        },
      ],
    },
  };
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.businessName,
  legalName: SITE.legalName,
  description: SITE.description,
  url: SITE_URL,
  telephone: SITE.phoneDisplay,
  areaServed: [
    {
      "@type": "City",
      name: "Москва",
    },
    {
      "@type": "AdministrativeArea",
      name: "Московская область",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Москва",
    addressRegion: "Москва и Московская область",
    addressCountry: "RU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SITE.phoneDisplay,
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: ["ru"],
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Услуги",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  },
  sameAs: [SITE.whatsappHref],
  image: absoluteUrl("/images/optimized/hero-interior.webp"),
  priceRange: "$$",
};
