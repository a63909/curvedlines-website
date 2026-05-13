import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border-dark)] bg-[rgba(3,4,3,0.94)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="overflow-hidden rounded-xl border border-white/8 bg-black/50">
            <Image
              src="/images/optimized/service-welding.webp"
              alt={SITE.brandName}
              width={106}
              height={75}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
          </div>
          <div className="hidden min-w-0 sm:block">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-white/55">
              Москва и область
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-white">
              {SITE.brandName}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] font-normal text-white/86 xl:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[color:var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={SITE.phoneHref}
            className="hidden text-sm font-medium text-white/88 transition hover:text-white lg:inline-flex"
          >
            {SITE.phoneDisplay}
          </a>
          <a
            href="#contacts"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white px-4 text-sm font-semibold text-white transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] sm:px-5"
          >
            Оставить заявку
          </a>
        </div>
      </div>

      <nav className="border-t border-white/10 xl:hidden">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-white/82 transition hover:border-[color:var(--accent)] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--header)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <div className="inline-flex overflow-hidden rounded-2xl border border-white/10 bg-black/50">
            <Image
              src="/images/optimized/service-welding.webp"
              alt={SITE.brandName}
              width={140}
              height={100}
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
            {SITE.description}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/50">
            Навигация
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
            <Link href="/">Главная</Link>
            <Link href="/remont-kvartir-moskva">Ремонт квартир</Link>
            <Link href="/restavraciya-vann-moskva">Реставрация ванн</Link>
            <Link href="/svarochnye-raboty-moskva">Сварочные работы</Link>
            <Link href="/ceni">Цены</Link>
            <Link href="/kontakty">Контакты</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/50">
            Контакты
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
            <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">
              {SITE.whatsappLabel}
            </a>
            <p>{SITE.hoursLabel}</p>
            <p>{SITE.region}</p>
            <p>{SITE.legalName}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingContacts() {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden justify-end lg:flex">
      <div className="pointer-events-auto flex gap-2 rounded-full border border-[color:var(--border)] bg-white/95 p-2 shadow-[0_20px_55px_rgba(20,20,20,0.16)] backdrop-blur">
        <a
          href={SITE.phoneHref}
          className="flex min-h-12 min-w-40 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
        >
          Позвонить
        </a>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 min-w-44 items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
