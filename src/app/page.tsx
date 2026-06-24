import Script from "next/script";

import {
  AboutSection,
  AdvantagesSection,
  BathRestorationSection,
  CertificatesSection,
  ContactsSection,
  FaqSection,
  HeroSection,
  PricingSection,
  ProcessSection,
  ProjectsSection,
  RepairTypesSection,
  ServicesSection,
  WeldingSection,
} from "@/components/site-sections";
import { FAQ_ITEMS, SITE, buildFaqPageSchema, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title:
    "Кривые Линии Design — ремонт квартир, реставрация ванн и сварочные работы в Москве",
  description:
    "Ремонт квартир под ключ, реставрация ванн жидким акрилом и сварочные работы в Москве и Московской области. Выезд, смета, договор, аккуратное выполнение.",
  path: "/",
  keywords: [
    "ремонт квартир москва",
    "ремонт квартир под ключ москва",
    "реставрация ванн москва",
    "сварочные работы москва",
    "ремонт квартир московская область",
  ],
});

export default function Home() {
  return (
    <main className="flex-1 pb-24">
      <Script
        id="home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqPageSchema(FAQ_ITEMS)),
        }}
      />
      <HeroSection
        eyebrow="Ремонт, ванны, сварка"
        title="Ремонт квартир и реставрация ванн в Москве и МО"
        description="Полный спектр работ — от косметического ремонта до «под ключ», реставрация ванн и надежные сварочные конструкции."
        bullets={[
          "Выезд по Москве и области",
          "Работа по договору",
          "Фиксированная смета",
          "Аккуратные мастера",
        ]}
        stats={[
          { value: "3 услуги", label: "Ремонт, реставрация ванн и сварочные работы" },
          { value: "09:00–21:00", label: "Ежедневно на связи по телефону и в WhatsApp" },
          { value: "Москва + МО", label: "Выезжаем по городу и Московской области" },
          { value: "Под ключ", label: "Берем как локальные, так и комплексные задачи" },
        ]}
        primaryLabel="Оставить заявку"
        primaryHref="#contacts"
        secondaryLabel="Написать в WhatsApp"
        secondaryHref={SITE.whatsappHref}
      />
      <ServicesSection />
      <RepairTypesSection />
      <BathRestorationSection />
      <WeldingSection />
      <AdvantagesSection />
      <ProcessSection />
      <ProjectsSection />
      <PricingSection />
      <CertificatesSection />
      <AboutSection />
      <FaqSection />
      <ContactsSection />
    </main>
  );
}
