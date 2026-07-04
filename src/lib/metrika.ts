type YandexMetrika = (
  counterId: number,
  method: "reachGoal",
  goal: string,
) => void;

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

const metrikaCounterId = Number(
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "",
);

export function reachMetrikaGoal(goal: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (!Number.isSafeInteger(metrikaCounterId) || metrikaCounterId <= 0) {
    return;
  }

  if (typeof window.ym !== "function") {
    return;
  }

  window.ym(metrikaCounterId, "reachGoal", goal);
}
