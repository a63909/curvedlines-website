import {
  BathRestorationSection,
  ContactsSection,
  FaqSection,
  FeatureBand,
  HeroSection,
  PricingSection,
  RelatedServicesSection,
} from "@/components/site-sections";
import { BATH_FEATURES, SITE, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Реставрация ванн в Москве и Московской области",
  description:
    "Реставрация ванн в Москве и МО: жидкий акрил, литьевой мрамор, восстановление сколов и изношенной эмали без замены чаши. Подскажем подходящий способ и рассчитаем стоимость.",
  path: "/restavraciya-vann-moskva",
  keywords: [
    "реставрация ванн москва",
    "жидкий акрил ванна москва",
    "литьевой мрамор ванна москва",
    "восстановление ванны московская область",
  ],
});

export default function BathRestorationPage() {
  return (
    <main className="flex-1 pb-24">
      <HeroSection
        eyebrow="Реставрация ванн"
        title="Реставрация ванн в Москве и Московской области"
        description="Восстанавливаем ванны жидким акрилом и литьевым мрамором, когда хочется вернуть аккуратный вид без демонтажа и лишних затрат."
        bullets={[
          "Жидкий акрил",
          "Литьевой мрамор",
          "Подготовка поверхности",
          "Уточнение состояния по фото",
        ]}
        stats={[
          { value: "1 выезд", label: "Во многих случаях достаточно одного приезда" },
          { value: "Без демонтажа", label: "Не нужно ломать санузел ради замены" },
          { value: "Фото", label: "Можно получить ориентир до осмотра" },
          { value: "Аккуратно", label: "Подходим и для жилых квартир" },
        ]}
        primaryLabel="Оставить заявку"
        primaryHref="#contacts"
        secondaryLabel="Открыть WhatsApp"
        secondaryHref={SITE.whatsappHref}
      />
      <FeatureBand
        eyebrow="Преимущества услуги"
        title="Почему люди выбирают восстановление вместо замены"
        description="Подскажем, какой способ восстановления подойдет вашей ванне, сколько займет работа и что входит в подготовку поверхности."
        items={BATH_FEATURES}
      />
      <BathRestorationSection />
      <PricingSection />
      <FaqSection />
      <RelatedServicesSection currentHref="/restavraciya-vann-moskva" />
      <ContactsSection defaultWorkType="Реставрация ванны" />
    </main>
  );
}
