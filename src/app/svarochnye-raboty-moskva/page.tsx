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
import { WELDING_FEATURES, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Сварочные работы в Москве и Московской области",
  description:
    "Сварочные работы в Москве и МО: перила, ворота, навесы, каркасы, ограждения и другие металлоконструкции по размерам с выездом и монтажом.",
  path: "/svarochnye-raboty-moskva",
  keywords: [
    "сварочные работы москва",
    "сварщик москва",
    "изготовление металлоконструкций москва",
    "сварочные работы московская область",
  ],
});

export default function WeldingPage() {
  return (
    <main className="flex-1 pb-24">
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
      <FaqSection />
      <RelatedServicesSection currentHref="/svarochnye-raboty-moskva" />
      <ContactsSection defaultWorkType="Сварочные работы" />
    </main>
  );
}
