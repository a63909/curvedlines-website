/** Server-only transport. Never import this module from a client component. */
export type MaydayLead = {
  request_id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  page: string;
};

export async function deliverMaydayLead(
  lead: MaydayLead,
  env: Record<string, string | undefined> = process.env,
  transport: typeof fetch = fetch,
): Promise<boolean> {
  const key = env.MAYDAY_SITE_KEY?.trim();
  if (!key) return false;
  if (!/^mday_site_[A-Za-z0-9_-]{43}$/.test(key)) throw new Error("mayday_config_invalid");
  const endpoint = env.MAYDAY_LEADS_URL?.trim() || "https://153.76.172.25/mayday-bots/v1/leads";
  const url = new URL(endpoint);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash)
    throw new Error("mayday_config_invalid");
  const body = JSON.stringify(lead);
  for (let attempt = 0; attempt < 3; attempt++) {
    let retry = true;
    try {
      const response = await transport(url, {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(5000),
      });
      if (response.status === 202) {
        const receipt = await response.json();
        if (receipt?.ok === true && receipt?.result?.status === "queued"
            && /^[a-f0-9]{64}$/.test(receipt?.result?.message_id)) return true;
        throw new Error("mayday_receipt_invalid");
      }
      // Never include an upstream response, contact details or the key in diagnostics.
      retry = response.status === 429 || response.status >= 500;
      await response.body?.cancel();
    } catch { /* A lost response is safe to retry with exactly the same request_id/body. */ }
    if (!retry || attempt === 2) throw new Error("mayday_delivery_failed");
    await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
  }
  throw new Error("mayday_delivery_failed");
}
