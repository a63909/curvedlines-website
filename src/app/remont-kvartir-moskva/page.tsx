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
import { APARTMENT_FEATURES, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Ремонт квартир в Москве и Московской области",
  description:
    "Ремонт квартир в Москве и МО: косметический, капитальный и под ключ. Поможем с расчетом, материалами, сроками и поэтапным выполнением работ.",
  path: "/remont-kvartir-moskva",
  keywords: [
    "ремонт квартир москва",
    "ремонт квартиры под ключ москва",
    "капитальный ремонт квартиры москва",
    "косметический ремонт квартиры московская область",
  ],
});

export default function ApartmentRepairPage() {
  return (
    <main className="flex-1 pb-24">
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
      <FaqSection />
      <RelatedServicesSection currentHref="/remont-kvartir-moskva" />
      <ContactsSection defaultWorkType="Ремонт квартиры" />
    </main>
  );
}
