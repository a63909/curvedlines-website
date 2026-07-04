"use client";

import { useEffect } from "react";

import { reachMetrikaGoal } from "@/lib/metrika";

function isWhatsAppHref(href: string) {
  const normalizedHref = href.toLowerCase();

  return (
    normalizedHref.includes("wa.me/") ||
    normalizedHref.includes("whatsapp.com/") ||
    normalizedHref.startsWith("whatsapp://") ||
    normalizedHref.startsWith("intent://send")
  );
}

export function MetrikaClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        reachMetrikaGoal("phone_click");
        return;
      }

      if (isWhatsAppHref(href) || isWhatsAppHref(link.href)) {
        reachMetrikaGoal("whatsapp_click");
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}
