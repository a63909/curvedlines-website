import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import {
  SiteFooter,
  SiteHeader,
} from "@/components/site-layout";
import { SITE, SITE_URL, localBusinessSchema, websiteSchema } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.businessName,
    template: `%s | ${SITE.brandName}`,
  },
  description: SITE.description,
  applicationName: SITE.brandName,
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="site-background flex min-h-full flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </body>
    </html>
  );
}
