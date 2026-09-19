import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Кривые Линии — сайт обновляется",
  description:
    "Мы обновляем сайт «Кривые Линии». По вопросам ремонта, реставрации ванн и сварочных работ свяжитесь с нами по телефону или в WhatsApp.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Кривые Линии — сайт обновляется",
    description: "Новая версия сайта уже в работе.",
    url: "https://curvedlines.ru",
    siteName: "Кривые Линии",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Кривые Линии — сайт обновляется",
    description: "Новая версия сайта уже в работе.",
    images: ["/og.png"],
  },
};

const directions = ["Ремонт квартир", "Реставрация ванн", "Сварочные работы"];

export default function Home() {
  return (
    <main className="holding-page">
      <div className="holding-noise" aria-hidden="true" />
      <div className="holding-curve holding-curve-one" aria-hidden="true" />
      <div className="holding-curve holding-curve-two" aria-hidden="true" />

      <header className="holding-header">
        <Link className="holding-brand" href="/" aria-label="Кривые Линии">
          <span className="holding-brand-mark" aria-hidden="true">КЛ</span>
          <span>
            <strong>Кривые Линии</strong>
            <small>Москва · Московская область</small>
          </span>
        </Link>
        <span className="holding-status"><i aria-hidden="true" />сайт обновляется</span>
      </header>

      <section className="holding-content">
        <p className="holding-kicker">Новая версия уже в работе</p>
        <h1>Наводим<br /><em>красивый порядок.</em></h1>
        <p className="holding-lead">
          Скоро здесь появится новый сайт. А пока мы продолжаем работать и принимать ваши заявки.
        </p>
        <div className="holding-actions">
          <a className="holding-button holding-button-primary" href={SITE.phoneHref}>
            Позвонить <span aria-hidden="true">↗</span>
          </a>
          <a className="holding-button holding-button-secondary" href={SITE.whatsappHref} target="_blank" rel="noreferrer">
            Написать в WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="holding-footer">
        <div className="holding-directions" aria-label="Направления работы">
          {directions.map((direction, index) => (
            <span key={direction}><b>0{index + 1}</b>{direction}</span>
          ))}
        </div>
        <div className="holding-contact">
          <span>Ежедневно · 09:00—21:00</span>
          <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
        </div>
      </footer>
    </main>
  );
}


