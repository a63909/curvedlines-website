import {
  ContactsSection,
  FaqSection,
  HeroSection,
  PriceFactorsSection,
  PricingSection,
} from "@/components/site-sections";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Цены на ремонт квартир, реставрацию ванн и сварочные работы",
  description:
    "Цены на ремонт квартир, реставрацию ванн и сварочные работы в Москве и МО. Объясняем, из чего складывается стоимость и когда нужен замер.",
  path: "/ceni",
  keywords: [
    "цены на ремонт квартир москва",
    "стоимость реставрации ванны москва",
    "цены на сварочные работы москва",
  ],
});

export default function PricesPage() {
  return (
    <main className="flex-1 pb-24">
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
      <FaqSection />
      <ContactsSection defaultWorkType="Комплексный запрос" />
    </main>
  );
}
