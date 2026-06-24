import Script from "next/script";

import {
  ContactsSection,
  FeatureBand,
  HeroSection,
} from "@/components/site-sections";
import {
  SERVICE_AREAS,
  SITE,
  buildBreadcrumbSchema,
  buildMetadata,
} from "@/lib/site";

export const metadata = buildMetadata({
  title:
    "Контакты Кривые Линии Design — заявки на ремонт, ванны и сварочные работы",
  description:
    "Связаться с Кривые Линии Design: заявка на ремонт квартир, реставрацию ванн и сварочные работы в Москве и Московской области. Телефон, WhatsApp и форма заявки.",
  path: "/kontakty",
  keywords: [
    "контакты ремонт квартир москва",
    "заявка на реставрацию ванн москва",
    "контакты сварочные работы москва",
  ],
});

const contactsSchema = buildBreadcrumbSchema([
  { name: "Главная", path: "/" },
  { name: "Контакты", path: "/kontakty" },
]);

export default function ContactsPage() {
  return (
    <main className="flex-1 pb-24">
      <Script
        id="contacts-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactsSchema),
        }}
      />
      <HeroSection
        eyebrow="Контакты"
        title="Связь по ремонту квартир, реставрации ванн и сварочным работам"
        description="Позвоните, напишите в WhatsApp или оставьте заявку через форму. Можно сразу отправить фото, размеры и короткое описание задачи."
        bullets={[
          SITE.phoneDisplay,
          SITE.hoursLabel,
          SITE.region,
          "Фото и описание приветствуются",
        ]}
        stats={[
          { value: "Телефон", label: "Быстрый способ обсудить проект" },
          { value: "WhatsApp", label: "Удобно отправить фото и размеры" },
          { value: "Москва + МО", label: "Выезд по городу и области" },
          { value: "Заявка", label: "Можно сразу описать задачу и оставить контакты" },
        ]}
        primaryLabel="Написать в WhatsApp"
        primaryHref={SITE.whatsappHref}
        secondaryLabel="Позвонить"
        secondaryHref={SITE.phoneHref}
      />
      <FeatureBand
        eyebrow="Где работаем"
        title="Основные зоны выезда по Москве и Подмосковью"
        description="Уточним, выезжаем ли по вашему адресу, согласуем удобное время и подскажем, что лучше подготовить к осмотру."
        items={SERVICE_AREAS.map((area) => ({
          title: area,
          description:
            "Уточним формат работ, срок выезда и подскажем, что подготовить к осмотру объекта.",
        }))}
      />
      <ContactsSection
        defaultWorkType="Комплексный запрос"
        title="Оставьте контакты, и мы свяжемся с вами"
        description="Если удобнее не звонить сразу, заполните форму. Подойдет и для ремонта квартиры, и для реставрации ванны, и для сварочных задач."
      />
    </main>
  );
}
