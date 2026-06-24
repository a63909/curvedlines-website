import Script from "next/script";

import {
  ContactsSection,
  FaqSection,
  HeroSection,
  PriceFactorsSection,
  PricingSection,
} from "@/components/site-sections";
import {
  FAQ_ITEMS,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildMetadata,
} from "@/lib/site";

export const metadata = buildMetadata({
  title:
    "Цены на ремонт, реставрацию ванн и сварочные работы — Кривые Линии Design",
  description:
    "Ориентиры по стоимости ремонта квартир, реставрации ванн и сварочных работ. Итоговая цена зависит от объёма, материалов, состояния объекта и выезда мастера.",
  path: "/ceni",
  keywords: [
    "цены на ремонт квартир москва",
    "стоимость реставрации ванны москва",
    "цены на сварочные работы москва",
  ],
});

const pricesSchema = [
  buildBreadcrumbSchema([
    { name: "Главная", path: "/" },
    { name: "Цены", path: "/ceni" },
  ]),
  buildFaqPageSchema(FAQ_ITEMS),
];

export default function PricesPage() {
  return (
    <main className="flex-1 pb-24">
      <Script
        id="prices-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricesSchema),
        }}
      />
      <HeroSection
        eyebrow="Стоимость"
        title="Стоимость работ по ремонту, реставрации ванн и сварке"
        description="Показываем, от чего зависит стоимость по каждому направлению. Точный расчет делаем после осмотра или по фото, если задачу можно предварительно оценить удаленно."
        bullets={[
          "Без вымышленных ценников",
          "Логика расчета по каждому направлению",
          "Замер перед финальной сметой",
          "Оценка задачи по фото и описанию",
        ]}
        stats={[
          { value: "3 услуги", label: "Разбивка по направлениям" },
          { value: "Честно", label: "Показываем, что влияет на итог" },
          { value: "Удобно", label: "Можно отправить запрос с сайта" },
          { value: "Быстро", label: "Телефон и WhatsApp для связи" },
        ]}
        primaryLabel="Оставить заявку"
        primaryHref="#contacts"
        secondaryLabel="Перейти в контакты"
        secondaryHref="/kontakty"
      />
      <PricingSection />
      <PriceFactorsSection />
      <FaqSection items={FAQ_ITEMS} />
      <ContactsSection defaultWorkType="Комплексный запрос" />
    </main>
  );
}
