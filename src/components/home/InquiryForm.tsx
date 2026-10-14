"use client";

import { useActionState, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitInquiry, type InquiryActionState } from "@/lib/inquiry/actions";
import { callbackTimes, contactMethods, inquiryFromFormData, validateInquiry } from "@/lib/inquiry/schema";
import { cn } from "@/lib/cn";

export interface InquiryFormText {
  notConnected: string;
  notBooking: string;
  dataMinimization: string;
  fields: {
    name: string;
    phone: string;
    phoneHint: string;
    email: string;
    preferredLanguage: string;
    service: string;
    serviceNone: string;
    contactMethod: string;
    callbackTime: string;
  };
  contactMethods: Record<(typeof contactMethods)[number], string>;
  callbackTimes: Record<(typeof callbackTimes)[number], string>;
  errors: Record<string, string>;
  errorSummary: string;
  submit: string;
  sending: string;
  results: { notConnected: string; delivered: string; failed: string };
  honeypot: string;
}

type Status = "idle" | "not_connected" | InquiryActionState["status"];

/**
 * Inquiry form with localized validation. When delivery is not configured
 * (the current state), valid input is checked in the browser only and NOTHING
 * is transmitted; the visitor is told plainly that the form did not send.
 * Success is shown only when the server confirms delivery.
 */
export function InquiryForm({
  locale,
  connected,
  text,
  languages,
  services,
  privacyConsent,
}: {
  locale: string;
  connected: boolean;
  text: InquiryFormText;
  languages: { value: string; label: string }[];
  services: { value: string; label: string }[];
  /** Pre-rendered consent label (contains a localized link). */
  privacyConsent: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverState, formAction] = useActionState(submitInquiry, { status: "idle" } as InquiryActionState);
  const [pending, startTransition] = useTransition();

  const effectiveStatus: Status = status === "idle" && serverState.status !== "idle" ? serverState.status : status;
  const effectiveErrors = serverState.status === "invalid" && status === "idle" ? serverState.errors : errors;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = validateInquiry(inquiryFromFormData(data));
    if (!result.success) {
      setErrors(result.errors);
      setStatus("invalid");
      const firstInvalid = Object.keys(result.errors)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus());
      return;
    }
    setErrors({});
    if (!connected) {
      // Delivery is not configured: do not transmit anything.
      setStatus("not_connected");
      requestAnimationFrame(() => resultRef.current?.focus());
      return;
    }
    setStatus("idle");
    startTransition(() => formAction(data));
  }

  const err = (field: string) => effectiveErrors[field];
  const errText = (field: string) => (err(field) ? text.errors[err(field)!] ?? text.errors.required : undefined);
  const describedBy = (field: string, hint?: string) =>
    [hint, err(field) ? `inq-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const field = (invalid: boolean) =>
    cn(
      "mt-2 block min-h-12 w-full rounded-lg border bg-surface px-4 text-foreground placeholder:text-muted/70",
      invalid ? "border-danger ring-1 ring-danger" : "border-border-strong focus:border-primary",
    );
  const label = "block text-sm font-medium text-foreground";
  const errorClass = "mt-1.5 text-sm text-danger";
  const errorCount = Object.keys(effectiveErrors).filter((k) => k !== "website").length;

  return (
    <div>
      {!connected && (
        <div role="note" className="mb-6 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
          <p className="font-semibold">{text.notConnected}</p>
          <p className="mt-1">{text.notBooking}</p>
        </div>
      )}

      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {effectiveStatus === "invalid" && errorCount > 0 && (
          <p className="mb-5 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            {text.errorSummary.replace("{count}", String(errorCount))}
          </p>
        )}
        {effectiveStatus === "not_connected" && (
          <p data-testid="inquiry-not-connected" className="mb-5 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm font-medium text-warning">
            {text.results.notConnected}
          </p>
        )}
        {effectiveStatus === "not_configured" && (
          <p className="mb-5 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm font-medium text-warning">
            {text.results.notConnected}
          </p>
        )}
        {effectiveStatus === "failed" && (
          <p className="mb-5 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">{text.results.failed}</p>
        )}
        {effectiveStatus === "delivered" && (
          <p className="mb-5 rounded-lg border border-olive-200 bg-success-soft px-4 py-3 text-sm text-success">{text.results.delivered}</p>
        )}
      </div>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: hidden from people and assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            {text.honeypot}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="inq-name" className={label}>
            {text.fields.name} <span aria-hidden="true" className="text-danger">*</span>
          </label>
          <input id="inq-name" name="name" type="text" autoComplete="name" required maxLength={100}
            aria-invalid={!!err("name")} aria-describedby={describedBy("name")} className={field(!!err("name"))} />
          {err("name") && <p id="inq-name-error" className={errorClass}>{errText("name")}</p>}
        </div>

        <div>
          <label htmlFor="inq-phone" className={label}>
            {text.fields.phone} <span aria-hidden="true" className="text-danger">*</span>
          </label>
          <input id="inq-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={24}
            aria-invalid={!!err("phone")} aria-describedby={describedBy("phone", "inq-phone-hint")} className={field(!!err("phone"))} />
          <p id="inq-phone-hint" className="mt-1.5 text-xs text-muted">{text.fields.phoneHint}</p>
          {err("phone") && <p id="inq-phone-error" className={errorClass}>{errText("phone")}</p>}
        </div>

        <div>
          <label htmlFor="inq-email" className={label}>{text.fields.email}</label>
          <input id="inq-email" name="email" type="email" autoComplete="email" maxLength={254}
            aria-invalid={!!err("email")} aria-describedby={describedBy("email")} className={field(!!err("email"))} />
          {err("email") && <p id="inq-email-error" className={errorClass}>{errText("email")}</p>}
        </div>

        <div>
          <label htmlFor="inq-language" className={label}>{text.fields.preferredLanguage}</label>
          <select id="inq-language" name="preferredLanguage" defaultValue={locale} className={field(false)}>
            {languages.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="inq-service" className={label}>{text.fields.service}</label>
          <select id="inq-service" name="service" defaultValue="" className={field(false)}>
            <option value="">{text.fields.serviceNone}</option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>{text.fields.contactMethod}</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {contactMethods.map((method) => (
              <label key={method} className="inline-flex min-h-11 items-center gap-2 text-sm">
                <input type="radio" name="contactMethod" value={method} defaultChecked={method === "phone"} className="h-4 w-4 accent-primary" />
                {text.contactMethods[method]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="inq-callback" className={label}>{text.fields.callbackTime}</label>
          <select id="inq-callback" name="callbackTime" defaultValue="any" className={cn(field(false), "sm:max-w-xs")}>
            {callbackTimes.map((slot) => (
              <option key={slot} value={slot}>{text.callbackTimes[slot]}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted sm:col-span-2">{text.dataMinimization}</p>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="privacyConsent" required aria-invalid={!!err("privacyConsent")}
              aria-describedby={err("privacyConsent") ? "inq-privacyConsent-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            <span>{privacyConsent}</span>
          </label>
          {err("privacyConsent") && <p id="inq-privacyConsent-error" className={errorClass}>{errText("privacyConsent")}</p>}
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={pending}
            className="inline-flex min-h-12 items-center justify-center rounded-pill bg-primary px-7 font-medium text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60">
            {pending ? text.sending : text.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
