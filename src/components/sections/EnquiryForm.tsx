"use client";

import { cloneElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Paperclip } from "lucide-react";
import {
  ACCEPT_ATTR,
  enquiryTypes,
  readFields,
  validateFields,
  validateFile,
  verticalOptions,
  type EnquiryErrors,
} from "@/lib/validation/enquiry";
import { cn } from "@/lib/utils";
import { enquiryForm as t } from "@/content/pages/forms";

type ErrKey = keyof EnquiryErrors;

const STEPS = t.steps;
const LAST = STEPS.length - 1;
const STEP_FIELDS: ErrKey[][] = [
  ["enquiryType", "vertical"],
  ["location", "projectType", "capacity", "timeline", "requirements", "document"],
  ["fullName", "company", "email", "phone", "consent"],
];

const ROUTES = t.routes;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function EnquiryForm({ defaultType = "Project", tone = "light" }: { defaultType?: (typeof enquiryTypes)[number]; tone?: "light" | "dark" }) {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [type, setType] = useState<string>(defaultType);
  const [fileName, setFileName] = useState<string>("");
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  // Time trap for bots: measured from mount, sent with the submission.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
    // Service pages link here with ?vertical=… — preselect it (the select stays uncontrolled).
    const v = new URLSearchParams(location.search).get("vertical");
    const select = form.current?.querySelector<HTMLSelectElement>('select[name="vertical"]');
    if (select && verticalOptions.some((o) => o.value === v)) select.value = v!;
  }, []);

  function goTo(i: number, focusField?: string) {
    setStep(i);
    setMaxStep((m) => Math.max(m, i));
    // Keep the top of the form in view on small screens, then move focus into the new step.
    const top = form.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) form.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => {
      const target = focusField ? form.current?.querySelector<HTMLElement>(`[name="${focusField}"]`) : form.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
      target?.focus({ preventScroll: true });
    });
  }

  function collect() {
    const fd = new FormData(form.current!);
    fd.set("startedAt", String(startedAt.current));
    const errs = validateFields(readFields(fd));
    const doc = fd.get("document");
    const fileErr = validateFile(doc instanceof File ? doc : null);
    if (fileErr) errs.document = fileErr;
    return { fd, errs };
  }

  /** Earliest step holding an error, and that error's field. */
  function firstError(errs: EnquiryErrors, upTo = LAST) {
    for (let i = 0; i <= upTo; i++) {
      const name = STEP_FIELDS[i].find((f) => errs[f]);
      if (name) return { step: i, name };
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { fd, errs } = collect();
    // Before the last step only this step's fields are checked; later ones stay quiet.
    if (step < LAST) {
      const mine = Object.fromEntries(STEP_FIELDS[step].filter((f) => errs[f]).map((f) => [f, errs[f]])) as EnquiryErrors;
      setErrors((prev) => ({ ...Object.fromEntries(Object.entries(prev).filter(([k]) => !STEP_FIELDS[step].includes(k as ErrKey))), ...mine }));
      const bad = firstError(mine, step);
      if (bad) form.current?.querySelector<HTMLElement>(`[name="${bad.name}"]`)?.focus();
      else goTo(step + 1);
      return;
    }
    setErrors(errs);
    const bad = firstError(errs);
    if (bad) {
      if (bad.step !== step) goTo(bad.step, bad.name);
      else form.current?.querySelector<HTMLElement>(`[name="${bad.name}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: EnquiryErrors };
      if (res.ok && body.ok) {
        setStatus({ kind: "sent" });
        return;
      }
      if (body.errors) {
        setErrors(body.errors);
        const srv = firstError(body.errors);
        if (srv && srv.step !== step) goTo(srv.step, srv.name);
      }
      setStatus({ kind: "error", message: body.error ?? t.errors.generic });
    } catch {
      setStatus({ kind: "error", message: t.errors.network });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-line bg-white p-8 text-center lg:p-12">
        <CheckCircle2 aria-hidden className="mx-auto size-10 text-emerald" strokeWidth={1.5} />
        <p className="display mt-5 text-3xl text-navy">{t.success.title}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
          {t.success.copy}
        </p>
      </div>
    );
  }

  const isProject = type === "Project";
  const reached = (i: number) => i <= maxStep;
  return (
    <form
      ref={form}
      noValidate
      onSubmit={onSubmit}
      className={cn("relative scroll-mt-28 border p-5 sm:p-8 xl:p-10", tone === "dark" ? "border-white/10 bg-ivory-soft" : "border-line bg-white")}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="display text-3xl text-navy">{t.title}</h2>
        <p className="text-xs text-slate">
          <span aria-hidden className="text-maroon">*</span> {t.requiredLabel}
        </p>
      </div>

      {/* Progress: three steps, earlier ones can be revisited */}
      <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Enquiry steps">
        {STEPS.map((label, i) => {
          const on = i === step;
          const done = i < step;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => reached(i) && goTo(i)}
                disabled={!reached(i)}
                aria-current={on ? "step" : undefined}
                className="group block w-full text-left disabled:cursor-default"
              >
                <span className="block h-0.5 overflow-hidden bg-navy/10">
                  <span className={cn("block h-full bg-gold transition-[width] duration-500 ease-(--ease-premium)", on || done ? "w-full" : "w-0")} />
                </span>
                <span className={cn("mt-2.5 flex items-baseline gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors", on ? "text-navy" : done ? "text-navy/60 group-hover:text-navy" : "text-slate/50")}>
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="max-sm:sr-only">{label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy sm:hidden" aria-hidden>
        {STEPS[step]}
      </p>

      {/* All steps stay mounted (one grid cell) so the form keeps its height and every field submits */}
      <div className="mt-5 grid grid-cols-1 border-t border-line pt-5">
        <Step index={0} active={step}>
          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy">
              {t.typeQuestion}<span aria-hidden className="ml-1 text-maroon">*</span>
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ROUTES.map((r) => (
                <label
                  key={r.value}
                  className={cn(
                    "relative flex cursor-pointer flex-col border px-4 py-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-navy",
                    r.value === "Careers" && "sm:col-span-2 sm:flex-row sm:items-baseline sm:gap-3",
                    type === r.value ? "border-navy bg-white" : "border-line hover:border-navy/40",
                  )}
                >
                  <input type="radio" name="enquiryType" value={r.value} checked={type === r.value} onChange={() => setType(r.value)} className="sr-only" />
                  <span aria-hidden className={cn("absolute top-4 right-4 grid size-4 place-items-center rounded-full border transition-colors", type === r.value ? "border-maroon" : "border-navy/25")}>
                    <span className={cn("size-2 rounded-full bg-maroon transition-transform", type === r.value ? "scale-100" : "scale-0")} />
                  </span>
                  <span className="pr-6 text-sm font-semibold text-navy">{r.title}</span>
                  <span className={cn("text-xs leading-relaxed text-slate", r.value === "Careers" ? "mt-1 sm:mt-0" : "mt-1", type !== r.value && "max-sm:hidden")}>{r.copy}</span>
                </label>
              ))}
            </div>
            {errors.enquiryType && <p className="mt-2 text-xs font-medium text-maroon">{errors.enquiryType}</p>}
          </fieldset>
          <Field label={t.fields.vertical} name="vertical" error={errors.vertical} required={isProject} className="mt-4">
            <select name="vertical" defaultValue="" className={input(errors.vertical)}>
              <option value="" disabled>
                {t.fields.selectPlaceholder}
              </option>
              {verticalOptions.map((v) => (
                <option key={v.value} value={v.value}>
                  {t.fields.verticalLabels[v.value] ?? v.label}
                </option>
              ))}
            </select>
          </Field>
        </Step>

        <Step index={1} active={step}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t.fields.location.label} name="location" error={errors.location} required={isProject}>
              <input name="location" placeholder={t.fields.location.placeholder} className={input(errors.location)} />
            </Field>
            <Field label={t.fields.projectType.label} name="projectType" error={errors.projectType}>
              <input name="projectType" placeholder={t.fields.projectType.placeholder} className={input(errors.projectType)} />
            </Field>
            <Field label={t.fields.capacity.label} name="capacity" error={errors.capacity}>
              <input name="capacity" placeholder={t.fields.capacity.placeholder} className={input(errors.capacity)} />
            </Field>
            <Field label={t.fields.timeline} name="timeline" error={errors.timeline}>
              <select name="timeline" defaultValue="" className={input(errors.timeline)}>
                <option value="">{t.fields.selectPlaceholder}</option>
                {t.fields.timelineOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label={t.fields.requirements} name="requirements" error={errors.requirements} required className="sm:col-span-2">
              <textarea name="requirements" rows={3} className={cn(input(errors.requirements), "min-h-24 py-3")} />
            </Field>
            <Field label={t.fields.document.label} name="document" error={errors.document} className="sm:col-span-2">
              <label className={cn("flex min-h-12 cursor-pointer items-center gap-3 border border-dashed px-4 text-sm transition-colors hover:border-navy has-focus-visible:border-navy", errors.document ? "border-maroon" : "border-navy/25")}>
                <Paperclip aria-hidden className="size-4 shrink-0 text-slate" />
                <span className={cn("truncate", fileName ? "text-navy" : "text-slate")}>{fileName || t.fields.document.placeholder}</span>
                <input
                  id="field-document"
                  name="document"
                  type="file"
                  accept={ACCEPT_ATTR}
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  aria-describedby={errors.document ? "error-document" : undefined}
                  className="sr-only"
                />
              </label>
            </Field>
          </div>
        </Step>

        <Step index={2} active={step}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={t.fields.fullName} name="fullName" error={errors.fullName} required>
              <input name="fullName" autoComplete="name" className={input(errors.fullName)} />
            </Field>
            <Field label={t.fields.company} name="company" error={errors.company}>
              <input name="company" autoComplete="organization" className={input(errors.company)} />
            </Field>
            <Field label={t.fields.email} name="email" error={errors.email} required>
              <input name="email" type="email" autoComplete="email" inputMode="email" className={input(errors.email)} />
            </Field>
            <Field label={t.fields.phone} name="phone" error={errors.phone} required>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={input(errors.phone)} />
            </Field>
          </div>
          <div className="mt-6">
            <label className="flex gap-3 text-sm leading-relaxed text-slate">
              <input
                name="consent"
                type="checkbox"
                value="yes"
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "error-consent" : undefined}
                className="mt-1 size-4 shrink-0 accent-maroon"
              />
              <span>
                {t.consent.before}{" "}
                <Link href={t.consent.linkHref} className="text-maroon underline underline-offset-2">
                  {t.consent.linkLabel}
                </Link>
                {t.consent.after}
              </span>
            </label>
            {errors.consent && (
              <p id="error-consent" className="mt-2 text-xs font-medium text-maroon">
                {errors.consent}
              </p>
            )}
          </div>
        </Step>
      </div>

      {/* Spam protection: honeypot + time trap */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === "error" && (
        <p role="alert" className="mt-6 flex gap-3 border border-maroon/30 bg-maroon/5 p-4 text-sm text-maroon">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </p>
      )}

      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="flex min-h-13 items-center gap-2 border border-navy/20 px-5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-navy"
          >
            <ArrowLeft aria-hidden className="size-4" />
            <span className="max-sm:sr-only">{t.buttons.back}</span>
          </button>
        )}
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="flex min-h-13 flex-1 items-center justify-center gap-2 bg-maroon px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-maroon-light disabled:opacity-60"
        >
          {step < LAST ? (
            <>
              {t.buttons.continue} <span className="font-normal normal-case tracking-normal text-white/60">— {STEPS[step + 1]}</span>
              <ArrowRight aria-hidden className="size-4" />
            </>
          ) : status.kind === "sending" ? (
            t.buttons.sending
          ) : (
            t.buttons.submit
          )}
        </button>
      </div>
    </form>
  );
}

/** One step of the form. Inactive steps keep their layout (and values) but are hidden and inert. */
function Step({ index, active, children }: { index: number; active: number; children: React.ReactNode }) {
  const on = index === active;
  return (
    <div
      data-step={index}
      role="group"
      aria-label={`Step ${index + 1} of ${STEPS.length}: ${STEPS[index]}`}
      aria-hidden={!on}
      inert={!on}
      tabIndex={-1}
      className={cn("[grid-area:1/1] outline-none", on ? "animate-panel-in" : "invisible")}
    >
      {children}
    </div>
  );
}

const input = (error?: string) =>
  cn(
    "block min-h-12 w-full border bg-ivory-soft px-3.5 text-[0.9375rem] text-charcoal transition-colors placeholder:text-slate/60 focus:border-navy focus:bg-white focus:outline-none",
    error ? "border-maroon" : "border-line",
  );

function Field({
  label,
  name,
  error,
  required,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactElement<Record<string, unknown>>;
}) {
  const id = `field-${name}`;
  const isFile = name === "document";
  const child = isFile
    ? children
    : cloneElement(children, {
        id,
        "aria-invalid": !!error,
        "aria-required": required || undefined,
        "aria-describedby": error ? `error-${name}` : undefined,
      });
  return (
    <div className={className}>
      {isFile ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy">{label}</p>
      ) : (
        <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
          {label}
          {required && (
            <span aria-hidden className="ml-1 text-maroon">
              *
            </span>
          )}
        </label>
      )}
      {child}
      {error && (
        <p id={`error-${name}`} className="mt-1.5 text-xs font-medium text-maroon">
          {error}
        </p>
      )}
    </div>
  );
}
