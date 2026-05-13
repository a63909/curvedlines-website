import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { LeadForm } from "@/components/lead-form";
import {
  ADVANTAGES,
  APARTMENT_FEATURES,
  BATH_EXTRAS,
  BATH_FEATURES,
  BATH_METHODS,
  CERTIFICATES,
  FAQ_ITEMS,
  PRICE_FACTORS,
  PRICING,
  PROJECTS,
  REPAIR_TYPES,
  SERVICE_AREAS,
  SERVICES,
  SITE,
  STEPS,
  WELDING_FEATURES,
  WELDING_WORKS,
} from "@/lib/site";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  stats: Array<{ value: string; label: string }>;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type FeatureBandProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
};

type ContactsSectionProps = {
  defaultWorkType?: string;
  title?: string;
  description?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function getHeroImage(title: string) {
  if (title.toLowerCase().includes("ремонт квартир и реставрация ванн")) {
    return "/images/optimized/hero-interior.webp";
  }

  if (title.toLowerCase().includes("реставрация")) {
    return "/images/optimized/work-14.webp";
  }

  if (title.toLowerCase().includes("свароч")) {
    return "/images/optimized/welding-hero-realistic.webp";
  }

  if (title.toLowerCase().includes("контакт")) {
    return "/images/optimized/repair-type-3.webp";
  }

  if (title.toLowerCase().includes("стоим")) {
    return "/images/optimized/repair-type-4.webp";
  }

  if (title.toLowerCase().includes("ремонт квартир")) {
    return "/images/optimized/hero-interior.webp";
  }

  return "/images/optimized/hero-interior.webp";
}

function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const className = primary
    ? "inline-flex min-h-14 items-center justify-center rounded-full bg-[color:var(--accent)] px-8 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
    : "inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--soft)]";

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function HeroSection({
  eyebrow,
  title,
  description,
  bullets,
  stats,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: HeroSectionProps) {
  const heroImage = getHeroImage(title);

  return (
    <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-18 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(52,37,12,0.56),rgba(0,0,0,0.72))]" />

          <div className="relative z-10 flex min-h-[620px] flex-col items-center justify-center px-5 py-14 text-center sm:px-8 lg:min-h-[700px] lg:px-16">
            <span className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/82">
              {eyebrow}
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.14] text-white sm:text-5xl lg:text-[56px]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/86 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
              <ActionLink href={primaryHref} primary>
                {primaryLabel}
              </ActionLink>
              <ActionLink href={secondaryHref}>{secondaryLabel}</ActionLink>
            </div>

            {bullets.length > 0 ? (
              <div className="mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
                {bullets.map((bullet) => (
                  <span
                    key={bullet}
                    className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-medium text-white/88"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
            ) : null}

            {stats.length > 0 ? (
              <div className="mt-10 grid w-full max-w-5xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-white/12 bg-white/12 px-5 py-5 text-left shadow-[0_20px_45px_rgba(0,0,0,0.08)] backdrop-blur-sm"
                  >
                    <div className="text-lg font-semibold text-white">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/74">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-4xl lg:text-[42px]">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-8 text-[color:var(--muted)] sm:text-base">
        {description}
      </p>
    </div>
  );
}

function SectionShell({
  id,
  children,
  soft = false,
}: {
  id?: string;
  children: ReactNode;
  soft?: boolean;
}) {
  return (
    <section
      id={id}
      className={`px-4 py-[90px] sm:px-6 lg:px-8 lg:py-[120px] ${
        soft ? "section-soft" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <SectionShell id="services" soft>
      <SectionHeading
        eyebrow="Услуги"
        title="Наши услуги"
        description="Три направления, с которыми можно обратиться к нам: ремонт квартир, реставрация ванн и сварочные работы в Москве и Московской области."
        centered
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <article
            key={service.title}
            className="section-card group overflow-hidden rounded-[28px]"
          >
            <div className="relative aspect-[1.06/1]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">
                {service.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[color:var(--muted)]">
                {service.description}
              </p>
              <ul className="mt-5 space-y-3">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-[18px] bg-[color:var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[color:var(--muted-strong)]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                Подробнее
              </Link>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function RepairTypesSection() {
  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Ремонт квартир"
        title="Виды ремонта квартир"
        description="Подбираем формат ремонта под состояние квартиры, задачи семьи, бюджет и желаемый уровень отделки."
        centered
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((columnIndex) => (
          <div
            key={columnIndex}
            className="section-card rounded-[28px] p-7 sm:p-8"
          >
            <div className="space-y-6">
              {REPAIR_TYPES.filter((_, index) => index % 2 === columnIndex).map(
                (item) => (
                  <article
                    key={item.title}
                    className="border-b border-[rgba(23,24,29,0.08)] pb-6 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
                      {item.description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function BathRestorationSection() {
  return (
    <SectionShell soft>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Реставрация ванн"
            title="Реставрация ванн: жидкий акрил и литьевой мрамор"
            description="Мы занимаемся профессиональной реставрацией ванн и подбираем способ восстановления под текущее состояние чаши."
          />
          <div className="mt-8 space-y-4">
            {BATH_METHODS.map((item) => (
              <article
                key={item.title}
                className="section-card rounded-[24px] p-5"
              >
                <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 section-card rounded-[24px] p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Дополнительные услуги
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {BATH_EXTRAS.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[color:var(--surface-muted)] px-4 py-2 text-sm text-[color:var(--muted-strong)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
          <Image
            src="/images/optimized/work-14.webp"
            alt="Реставрация ванн"
            width={1680}
            height={945}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function WeldingSection() {
  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Сварочные работы"
        title="Сварочные работы"
        description="Работаем по размерам и задачам заказчика, помогаем подобрать решение под бюджет и условия эксплуатации."
        centered
      />
      <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="group overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
          <Image
            src="/images/optimized/welding-hero-realistic.webp"
            alt="Сварочные работы"
            width={967}
            height={732}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {WELDING_WORKS.map((item) => (
            <article
              key={item.title}
              className="section-card rounded-[24px] p-5"
            >
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function AdvantagesSection() {
  return (
    <SectionShell id="advantages" soft>
      <SectionHeading
        eyebrow="Преимущества"
        title="Почему выбирают нас"
        description="Работаем аккуратно, заранее согласуем смету и сроки, держим связь и доводим дело до готового результата."
        centered
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ADVANTAGES.map((item) => (
          <article
            key={item.title}
            className="section-card rounded-[28px] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--soft)]">
                <Image src={item.icon} alt="" width={20} height={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function ProcessSection() {
  return (
    <SectionShell id="steps">
      <SectionHeading
        eyebrow="Этапы"
        title="Этапы работы"
        description="Путь от первой заявки до готового результата у нас прозрачный и понятный: вы знаете, что будет дальше и на каком этапе находится проект."
        centered
      />
      <div className="mt-14 grid gap-5 xl:grid-cols-4">
        {STEPS.map((item, index) => (
          <article
            key={item.title}
            className="section-card relative rounded-[28px] p-6"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--soft)]">
              <Image src={item.icon} alt="" width={24} height={24} />
            </div>
            <span className="mt-5 block text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--accent)]">
              Шаг {index + 1}
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function ProjectsSection({ id }: { id?: string } = {}) {
  return (
    <SectionShell id={id ?? "projects"} soft>
      <SectionHeading
        eyebrow="Наши работы"
        title="Здесь вы можете увидеть примеры наших работ"
        description="Показываем не абстрактные обещания, а реальные визуальные примеры: квартиры после ремонта, интерьеры, реставрацию и сварочные задачи."
        centered
      />

      <div className="no-scrollbar mt-14 flex gap-5 overflow-x-auto pb-2">
        {PROJECTS.map((project) => (
          <article
            key={project.title}
            className="section-card group min-w-[285px] max-w-[285px] shrink-0 overflow-hidden rounded-[28px] sm:min-w-[340px] sm:max-w-[340px]"
          >
            <div className="relative aspect-[0.92/1]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 640px) 340px, 285px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                {project.category}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">
                {project.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
                {project.summary}
              </p>
              <p className="mt-4 text-sm font-medium text-[color:var(--muted-strong)]">
                {project.term}
              </p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function PricingSection() {
  return (
    <SectionShell id="pricing">
      <SectionHeading
        eyebrow="Стоимость"
        title="Стоимость работ"
        description="Стоимость зависит от объема и сложности работ. Мы бесплатно выезжаем на объект, рассчитываем смету и предлагаем несколько вариантов по бюджету."
        centered
      />

      <div className="mt-14 grid gap-6 xl:grid-cols-3">
        {PRICING.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--soft)] p-7 shadow-[var(--shadow-soft)]"
          >
            <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {item.description}
            </p>
            <div className="mt-6 text-4xl font-semibold leading-none text-[color:var(--foreground)]">
              {item.price}
            </div>
            <ul className="mt-6 space-y-3">
              {item.factors.map((factor) => (
                <li
                  key={factor}
                  className="rounded-[20px] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--muted-strong)]"
                >
                  {factor}
                </li>
              ))}
            </ul>
            <a
              href="#contacts"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
            >
              Оставить заявку
            </a>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function CertificatesSection() {
  return (
    <SectionShell soft>
      <SectionHeading
        eyebrow="Сертификаты"
        title="Сертификаты"
        description="Показываем документы и подтверждения, которые усиливают доверие к качеству используемых решений и материалов."
        centered
      />

      <div className="no-scrollbar mt-14 flex gap-5 overflow-x-auto pb-2">
        {CERTIFICATES.map((src, index) => (
          <div
            key={src}
            className="section-card min-w-[260px] max-w-[260px] shrink-0 overflow-hidden rounded-[24px] bg-white p-3 sm:min-w-[320px] sm:max-w-[320px]"
          >
            <div className="overflow-hidden rounded-[18px] bg-white">
              <Image
                src={src}
                alt={`Сертификат ${index + 1}`}
                width={620}
                height={877}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function AboutSection() {
  return (
    <SectionShell>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="rounded-[28px] bg-[color:var(--soft)] p-7 shadow-[var(--shadow-soft)] sm:p-8">
          <SectionHeading
            eyebrow="О компании"
            title="О компании"
            description={SITE.aboutDescription}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[color:var(--muted-strong)]">
              Ремонт квартир
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[color:var(--muted-strong)]">
              Реставрация ванн
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[color:var(--muted-strong)]">
              Сварочные работы
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
          <Image
            src="/images/optimized/about-company.webp"
            alt={SITE.brandName}
            width={785}
            height={556}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function FaqSection() {
  return (
    <SectionShell id="faq">
      <SectionHeading
        eyebrow="Вопросы и ответы"
        title="Ответы на частые вопросы"
        description="Собрали базовые вопросы, которые чаще всего появляются до старта работ и составления сметы."
        centered
      />
      <div className="mx-auto mt-14 max-w-4xl">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={item.question}
            className={`group ${index === 0 ? "border-t" : ""} border-b border-[color:var(--border)] py-6`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-xl font-semibold text-[color:var(--foreground)]">
              <span>{item.question}</span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--soft)] text-2xl text-[color:var(--foreground)] transition group-open:bg-[color:var(--accent)] group-open:text-white">
                +
              </span>
            </summary>
            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[color:var(--muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

export function ContactsSection({
  defaultWorkType = "Комплексный запрос",
  title = "Оставьте заявку — перезвоним, уточним детали и при необходимости приедем на объект",
  description = "Связаться можно по телефону, через WhatsApp или через форму на сайте. Если удобно, сначала отправьте фото и короткое описание задачи.",
}: ContactsSectionProps) {
  return (
    <SectionShell id="contacts">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="section-card rounded-[32px] p-6 md:p-8">
          <SectionHeading
            eyebrow="Контакты"
            title={title}
            description={description}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <a
              href={SITE.phoneHref}
              className="rounded-[24px] bg-[color:var(--surface-muted)] p-5 transition hover:bg-[color:var(--soft)]"
            >
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                Телефон
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
                {SITE.phoneDisplay}
              </p>
            </a>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-[24px] bg-[color:var(--surface-muted)] p-5 transition hover:bg-[color:var(--soft)]"
            >
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                WhatsApp
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
                Быстрая связь по фото
              </p>
            </a>
            <div className="rounded-[24px] bg-[color:var(--surface-muted)] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                График
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
                {SITE.hoursLabel}
              </p>
            </div>
            <div className="rounded-[24px] bg-[color:var(--surface-muted)] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                Регион
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
                {SITE.region}
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-[24px] bg-[color:var(--soft)] p-5">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
              География выезда
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {SERVICE_AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[color:var(--muted-strong)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <LeadForm defaultWorkType={defaultWorkType} />
      </div>
    </SectionShell>
  );
}

export function FeatureBand({
  id,
  eyebrow,
  title,
  description,
  items,
}: FeatureBandProps) {
  return (
    <SectionShell id={id} soft>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        centered
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="section-card rounded-[26px] p-6"
          >
            <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-7 text-[color:var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function PriceFactorsSection() {
  return (
    <FeatureBand
      eyebrow="Что влияет на цену"
      title="Смета складывается из понятных факторов"
      description="На стоимость влияет объем работ, состояние объекта, выбранные материалы и условия запуска проекта."
      items={PRICE_FACTORS}
    />
  );
}

export function RelatedServicesSection({
  currentHref,
}: {
  currentHref?: string;
}) {
  const relatedServices = SERVICES.filter((service) => service.href !== currentHref);

  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Смежные услуги"
        title="Если нужен не один вид работ"
        description="Если вам нужен не только один вид работ, поможем собрать удобный план и подобрать решение под квартиру, санузел или участок."
        centered
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {relatedServices.map((service) => (
          <article
            key={service.title}
            className="section-card group overflow-hidden rounded-[28px]"
          >
            <div className="relative aspect-[1.15/1]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">
                {service.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[color:var(--muted)]">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                Подробнее
              </Link>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function ApartmentFeatureBand() {
  return (
    <FeatureBand
      eyebrow="Что важно"
      title="Что важно перед началом ремонта квартиры"
      description="Обсуждаем смету, порядок работ, материалы и сроки до начала ремонта, чтобы вы понимали весь процесс заранее."
      items={APARTMENT_FEATURES}
    />
  );
}

export function BathFeatureBand() {
  return (
    <FeatureBand
      eyebrow="Преимущества услуги"
      title="Почему выбирают восстановление вместо замены"
      description="Реставрация позволяет быстро вернуть аккуратный внешний вид ванны без капитального вмешательства в санузел."
      items={BATH_FEATURES}
    />
  );
}

export function WeldingFeatureBand() {
  return (
    <FeatureBand
      eyebrow="Преимущества"
      title="Как мы подходим к сварочным задачам"
      description="Работаем под размеры, условия объекта и желаемый результат, не сводя все к шаблонным решениям."
      items={WELDING_FEATURES}
    />
  );
}
