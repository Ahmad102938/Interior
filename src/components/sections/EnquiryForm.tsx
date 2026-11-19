"use client";

import { cloneElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Paperclip } from "lucide-react";
import {
  ACCEPT_ATTR,
  enquiryTypes,
  readFields,
  timelineOptions,
  validateFields,
  validateFile,
  verticalOptions,
  type EnquiryErrors,
} from "@/lib/validation/enquiry";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function EnquiryForm({ defaultType = "Project", tone = "light" }: { defaultType?: (typeof enquiryTypes)[number]; tone?: "light" | "dark" }) {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [type, setType] = useState<string>(defaultType);
  const [fileName, setFileName] = useState<string>("");
  const form = useRef<HTMLFormElement>(null);
  // Time trap for bots: measured from mount, sent with the submission.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("startedAt", String(startedAt.current));
    const errs = validateFields(readFields(fd));
    const doc = fd.get("document");
    const fileErr = validateFile(doc instanceof File ? doc : null);
    if (fileErr) errs.document = fileErr;
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
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
      if (body.errors) setErrors(body.errors);
      setStatus({ kind: "error", message: body.error ?? "Please correct the highlighted fields." });
    } catch {
      setStatus({ kind: "error", message: "Network error — your enquiry has not been sent. Please try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-line bg-white p-8 text-center lg:p-12">
        <CheckCircle2 aria-hidden className="mx-auto size-10 text-emerald" strokeWidth={1.5} />
        <p className="display mt-5 text-3xl text-navy">Enquiry received.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
          Our team will review your enquiry and contact you regarding the project requirements.
        </p>
      </div>
    );
  }

  const isProject = type === "Project";
  return (
    <form ref={form} noValidate onSubmit={onSubmit} className={cn("relative border p-6 sm:p-8 lg:p-10", tone === "dark" ? "border-white/10 bg-ivory-soft" : "border-line bg-white")}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
        <h3 className="display text-3xl text-navy">Request a quote</h3>
        <p className="text-xs text-slate">
          <span aria-hidden className="text-maroon">*</span> Required
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Enquiry type" name="enquiryType" error={errors.enquiryType} required>
          <select name="enquiryType" value={type} onChange={(e) => setType(e.target.value)} className={input(errors.enquiryType)}>
            {enquiryTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Business vertical" name="vertical" error={errors.vertical} required={isProject}>
          <select name="vertical" defaultValue="" className={input(errors.vertical)}>
            <option value="" disabled>
              Select…
            </option>
            {verticalOptions.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Full name" name="fullName" error={errors.fullName} required>
          <input name="fullName" autoComplete="name" className={input(errors.fullName)} />
        </Field>
        <Field label="Company / organisation" name="company" error={errors.company}>
          <input name="company" autoComplete="organization" className={input(errors.company)} />
        </Field>
        <Field label="Official email" name="email" error={errors.email} required>
          <input name="email" type="email" autoComplete="email" inputMode="email" className={input(errors.email)} />
        </Field>
        <Field label="Mobile number" name="phone" error={errors.phone} required>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={input(errors.phone)} />
        </Field>
        <Field label="Project location" name="location" error={errors.location} required={isProject}>
          <input name="location" placeholder="City, State" className={input(errors.location)} />
        </Field>
        <Field label="Project type" name="projectType" error={errors.projectType}>
          <input name="projectType" placeholder="e.g. warehouse, rooftop solar, office fit-out" className={input(errors.projectType)} />
        </Field>
        <Field label="Area / capacity" name="capacity" error={errors.capacity}>
          <input name="capacity" placeholder="e.g. 20,000 sq ft or 2 MW" className={input(errors.capacity)} />
        </Field>
        <Field label="Expected timeline" name="timeline" error={errors.timeline}>
          <select name="timeline" defaultValue="" className={input(errors.timeline)}>
            <option value="">Select…</option>
            {timelineOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Project requirements" name="requirements" error={errors.requirements} required className="sm:col-span-2">
          <textarea name="requirements" rows={4} className={cn(input(errors.requirements), "min-h-28 py-3")} />
        </Field>
        <Field label="Drawings / BOQ / documents (optional)" name="document" error={errors.document} className="sm:col-span-2">
          <label className={cn("flex min-h-14 cursor-pointer items-center gap-3 border border-dashed px-4 text-sm transition-colors hover:border-navy", errors.document ? "border-maroon" : "border-navy/25")}>
            <Paperclip aria-hidden className="size-4 text-slate" />
            <span className={fileName ? "text-navy" : "text-slate"}>{fileName || "Attach a file — PDF, DOC, XLS, DWG, JPG or PNG, up to 10 MB"}</span>
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

      {/* Spam protection: honeypot + time trap */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
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
            I agree that Adidev may use these details to respond to my enquiry, as described in the{" "}
            <Link href="/privacy-policy" className="text-maroon underline underline-offset-2">
              privacy policy
            </Link>
            . Please do not upload confidential drawings unless required.
          </span>
        </label>
        {errors.consent && (
          <p id="error-consent" className="mt-2 text-xs font-medium text-maroon">
            {errors.consent}
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <p role="alert" className="mt-6 flex gap-3 border border-maroon/30 bg-maroon/5 p-4 text-sm text-maroon">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-8 flex min-h-13 w-full items-center justify-center bg-maroon px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-maroon-light disabled:opacity-60"
      >
        {status.kind === "sending" ? "Submitting…" : "Submit enquiry"}
      </button>
    </form>
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
