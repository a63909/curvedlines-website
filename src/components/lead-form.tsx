"use client";

import { type FormEvent, useState, useTransition } from "react";

import { SERVICE_OPTIONS, SITE } from "@/lib/site";

type LeadFormProps = {
  defaultWorkType?: string;
};

type FormState = {
  name: string;
  phone: string;
  workType: string;
  comment: string;
};

type ResultState =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

function makeInitialState(defaultWorkType?: string): FormState {
  return {
    name: "",
    phone: "",
    workType: defaultWorkType ?? SERVICE_OPTIONS[0],
    comment: "",
  };
}

function fieldClassName() {
  return "mt-2 w-full rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3.5 text-[15px] text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:bg-white";
}

export function LeadForm({ defaultWorkType }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    makeInitialState(defaultWorkType),
  );
  const [result, setResult] = useState<ResultState>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);

    startTransition(() => {
      void submitForm();
    });
  };

  const submitForm = async () => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(
          payload.message ?? "Не удалось отправить заявку. Попробуйте еще раз.",
        );
      }

      setResult({
        type: "success",
        message:
          payload.message ??
          "Заявка отправлена. Мы свяжемся с вами, чтобы уточнить детали работ.",
      });
      setForm(makeInitialState(defaultWorkType));
    } catch (error) {
      setResult({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при отправке формы.",
      });
    }
  };

  return (
    <form
      className="section-card rounded-[32px] p-6 md:p-8"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--accent)]">
        Форма заявки
      </p>
      <h3 className="mt-3 text-3xl font-semibold leading-tight text-[color:var(--foreground)]">
        Оставьте заявку и мы свяжемся с вами
      </h3>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-[color:var(--muted)]">
        Напишите, какой вид работ вам нужен, оставьте телефон и короткий
        комментарий. Можно сразу описать адрес, сроки и удобное время для
        звонка.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={SITE.phoneHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--border)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
        >
          {SITE.phoneDisplay}
        </a>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--soft)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--soft-strong)]"
        >
          Написать в WhatsApp
        </a>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[color:var(--foreground)]">
          Имя
          <input
            className={fieldClassName()}
            name="name"
            placeholder="Как к вам обращаться"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            autoComplete="name"
            required
          />
        </label>

        <label className="block text-sm font-medium text-[color:var(--foreground)]">
          Телефон
          <input
            className={fieldClassName()}
            name="phone"
            placeholder="+7 (___) ___-__-__"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-[color:var(--foreground)]">
        Вид работ
        <select
          className={fieldClassName()}
          name="workType"
          value={form.workType}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              workType: event.target.value,
            }))
          }
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium text-[color:var(--foreground)]">
        Комментарий
        <textarea
          className={`${fieldClassName()} min-h-36 resize-y`}
          name="comment"
          placeholder="Опишите задачу, площадь, состояние объекта или приложите это позже в WhatsApp"
          value={form.comment}
          onChange={(event) =>
            setForm((current) => ({ ...current, comment: event.target.value }))
          }
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-13 items-center justify-center rounded-full bg-[color:var(--accent)] px-7 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Отправляем..." : "Отправить заявку"}
        </button>
        <p className="max-w-xs text-xs leading-6 text-[color:var(--muted)]">
          Отправляя форму, вы даете согласие на обратную связь по вашему
          запросу.
        </p>
      </div>

      <div className="mt-5" aria-live="polite">
        {result ? (
          <p
            className={`rounded-[20px] px-4 py-3 text-sm ${
              result.type === "success"
                ? "bg-[rgba(45,125,77,0.12)] text-[#25603e]"
                : "bg-[rgba(179,72,54,0.12)] text-[#9d4337]"
            }`}
          >
            {result.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
