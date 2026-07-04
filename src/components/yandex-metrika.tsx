import Script from "next/script";

const metrikaCounterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();
const numericCounterId = Number(metrikaCounterId);

export function YandexMetrika() {
  if (
    !metrikaCounterId ||
    !Number.isSafeInteger(numericCounterId) ||
    numericCounterId <= 0
  ) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.ym = window.ym || function(){(window.ym.a = window.ym.a || []).push(arguments)};
          window.ym.l = 1 * new Date();
          ym(${numericCounterId}, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true
          });
        `}
      </Script>
      <Script
        id="yandex-metrika-tag"
        src={`https://mc.yandex.ru/metrika/tag.js?id=${metrikaCounterId}`}
        strategy="afterInteractive"
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${metrikaCounterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
