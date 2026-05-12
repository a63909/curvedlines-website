import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "linear-gradient(135deg, #f6efe5 0%, #f8d5be 42%, #1f1a16 100%)",
          color: "#1f1a16",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "#914322",
            }}
          >
            Москва и область
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              padding: "12px 20px",
              background: "rgba(255,255,255,0.8)",
              fontSize: 22,
            }}
          >
            {SITE.phoneDisplay}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: 950,
            }}
          >
            Ремонт квартир, реставрация ванн и сварочные работы
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 900,
              color: "rgba(31,26,22,0.76)",
            }}
          >
            Выезд, смета, договор и аккуратное выполнение работ по Москве и
            Московской области.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          {["Ремонт квартир", "Реставрация ванн", "Сварочные работы"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  borderRadius: 999,
                  padding: "14px 22px",
                  background: "rgba(255,255,255,0.78)",
                  fontSize: 24,
                  color: "#1f1a16",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
