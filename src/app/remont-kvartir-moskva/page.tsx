import Script from "next/script";

import {
  ContactsSection,
  FaqSection,
  FeatureBand,
  HeroSection,
  PriceFactorsSection,
  ProcessSection,
  RelatedServicesSection,
  RepairTypesSection,
} from "@/components/site-sections";
import {
  APARTMENT_FAQ_ITEMS,
  APARTMENT_FEATURES,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildMetadata,
} from "@/lib/site";

export const metadata = buildMetadata({
  title:
    "Ремонт квартир под ключ в Москве и МО — Кривые Линии Design",
  description:
    "Ремонт квартир под ключ в Москве и Московской области: демонтаж, отделка, электрика, сантехника, плитка, смета и договор. Оставьте заявку на выезд мастера.",
  path: "/remont-kvartir-moskva",
  keywords: [
    "ремонт квартир москва",
    "ремонт квартир под ключ москва",
    "ремонт квартир московская область",
    "ремонт квартир под ключ московская область",
  ],
});

const apartmentRepairSchema = [
  buildBreadcrumbSchema([
    { name: "Главная", path: "/" },
    { name: "Ремонт квартир", path: "/remont-kvartir-moskva" },
  ]),
  buildFaqPageSchema(APARTMENT_FAQ_ITEMS),
];

export default function ApartmentRepairPage() {
  return (
    <main className="flex-1 pb-24">
      <Script
        id="apartment-repair-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(apartmentRepairSchema),
        }}
      />
      <HeroSection
        eyebrow="Ремонт квартир"
        title="Ремонт квартир в Москве и Московской области"
        description="Делаем косметический, капитальный и комплексный ремонт квартир. До начала работ обсуждаем объем, сроки, материалы и составляем понятную смету."
        bullets={[
          "Косметический и капитальный ремонт",
          "Квартиры, студии, комнаты, санузлы",
          "Под аренду и для собственного проживания",
          "Смета после осмотра объекта",
        ]}
        stats={[
          { value: "Под ключ", label: "Можно собрать полный цикл ремонта" },
          { value: "Локально", label: "Или закрыть отдельное помещение" },
          { value: "Замер", label: "Выезд перед расчетом стоимости" },
          { value: "Четко", label: "Понятная логика этапов и материалов" },
        ]}
        primaryLabel="Оставить заявку"
        primaryHref="#contacts"
        secondaryLabel="Смотреть цены"
        secondaryHref="/ceni"
      />
      <FeatureBand
        eyebrow="Что важно"
        title="Что важно перед началом ремонта"
        description="Поможем определить объем работ, подскажем по материалам, рассчитаем смету и заранее согласуем порядок ремонта по этапам."
        items={APARTMENT_FEATURES}
      />
      <RepairTypesSection />
      <ProcessSection />
      <PriceFactorsSection />
      <FaqSection items={APARTMENT_FAQ_ITEMS} />
      <RelatedServicesSection currentHref="/remont-kvartir-moskva" />
      <ContactsSection defaultWorkType="Ремонт квартиры" />
    </main>
  );
}
