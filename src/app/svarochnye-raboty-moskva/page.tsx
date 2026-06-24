import Script from "next/script";

import {
  ContactsSection,
  FaqSection,
  FeatureBand,
  HeroSection,
  PriceFactorsSection,
  ProjectsSection,
  RelatedServicesSection,
  WeldingSection,
} from "@/components/site-sections";
import {
  WELDING_FAQ_ITEMS,
  WELDING_FEATURES,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildMetadata,
} from "@/lib/site";

export const metadata = buildMetadata({
  title:
    "Сварочные работы в Москве и Московской области — Кривые Линии Design",
  description:
    "Сварочные работы в Москве и МО: бытовые и строительные задачи, ремонт металлоконструкций, аккуратный выезд мастера и предварительная оценка работ.",
  path: "/svarochnye-raboty-moskva",
  keywords: [
    "сварочные работы москва",
    "сварочные работы московская область",
    "ремонт металлоконструкций москва",
    "сварщик москва",
  ],
});

const weldingSchema = [
  buildBreadcrumbSchema([
    { name: "Главная", path: "/" },
    { name: "Сварочные работы", path: "/svarochnye-raboty-moskva" },
  ]),
  buildFaqPageSchema(WELDING_FAQ_ITEMS),
];

export default function WeldingPage() {
  return (
    <main className="flex-1 pb-24">
      <Script
        id="welding-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(weldingSchema),
        }}
      />
      <HeroSection
        eyebrow="Сварочные работы"
        title="Сварочные работы в Москве и Московской области"
        description="Делаем металлоконструкции для дома, дачи и участка: перила, ворота, навесы, каркасы и другие изделия по размерам с выездом и монтажом."
        bullets={[
          "Лестницы и перила",
          "Ворота, навесы, каркасы",
          "Выезд на объект",
          "Расчет по размерам и сложности",
        ]}
        stats={[
          { value: "Замер", label: "Снимаем размеры прямо на объекте" },
          { value: "Монтаж", label: "Не только изготовление, но и установка" },
          { value: "Частные задачи", label: "Дома, дворы, подъездные группы" },
          { value: "Гибко", label: "От мелкого ремонта до конструкции" },
        ]}
        primaryLabel="Оставить заявку"
        primaryHref="#contacts"
        secondaryLabel="Посмотреть работы"
        secondaryHref="#projects"
      />
      <FeatureBand
        eyebrow="Преимущества"
        title="Сварочные работы для дома, дачи и участка"
        description="Делаем ворота, перила, навесы, каркасы и другие металлоконструкции. Стоимость зависит от размера, материала и сложности монтажа."
        items={WELDING_FEATURES}
      />
      <WeldingSection />
      <ProjectsSection id="projects" />
      <PriceFactorsSection />
      <FaqSection items={WELDING_FAQ_ITEMS} />
      <RelatedServicesSection currentHref="/svarochnye-raboty-moskva" />
      <ContactsSection defaultWorkType="Сварочные работы" />
    </main>
  );
}
