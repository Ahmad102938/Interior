/**
 * Shared enquiry validation — used by the form (instant feedback) and the API
 * route (authoritative). No external schema library needed for this size.
 */
export const enquiryTypes = ["Project", "Vendor", "Partnership", "General", "Careers"] as const;
export const verticalOptions = [
  { value: "telecom", label: "Telecom Infrastructure" },
  { value: "solar", label: "Solar & Renewable Energy" },
  { value: "civil", label: "Civil Construction & Infrastructure" },
  { value: "interiors", label: "Commercial Interior & Fit-Out" },
  { value: "other", label: "Other" },
] as const;
export const timelineOptions = ["Immediate", "Within 3 months", "3–6 months", "6–12 months", "Not yet decided"] as const;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "dwg", "jpg", "jpeg", "png"] as const;
export const ACCEPT_ATTR = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export type EnquiryFields = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  enquiryType: string;
  vertical: string;
  location: string;
  projectType: string;
  capacity: string;
  timeline: string;
  requirements: string;
  consent: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryFields | "document", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian and international numbers: optional +, 8–15 digits, common separators.
const PHONE = /^\+?[0-9][0-9\s\-()]{7,18}$/;

export function readFields(fd: FormData): EnquiryFields {
  const g = (k: string) => String(fd.get(k) ?? "").trim();
  return {
    fullName: g("fullName"),
    company: g("company"),
    email: g("email"),
    phone: g("phone"),
    enquiryType: g("enquiryType"),
    vertical: g("vertical"),
    location: g("location"),
    projectType: g("projectType"),
    capacity: g("capacity"),
    timeline: g("timeline"),
    requirements: g("requirements"),
    consent: g("consent"),
  };
}

export function validateFields(f: EnquiryFields): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (f.fullName.length < 2) e.fullName = "Please enter your full name.";
  if (f.fullName.length > 120) e.fullName = "Name is too long.";
  if (!EMAIL.test(f.email)) e.email = "Please enter a valid email address.";
  const digits = f.phone.replace(/\D/g, "");
  if (!PHONE.test(f.phone) || digits.length < 8 || digits.length > 15) e.phone = "Please enter a valid contact number.";
  if (!enquiryTypes.includes(f.enquiryType as (typeof enquiryTypes)[number])) e.enquiryType = "Please choose an enquiry type.";
  if (f.enquiryType === "Project") {
    if (!verticalOptions.some((v) => v.value === f.vertical)) e.vertical = "Please choose a business vertical.";
    if (f.location.length < 2) e.location = "Please enter the project location.";
  }
  if (f.requirements.length < 10) e.requirements = "Please describe your requirements (at least 10 characters).";
  if (f.requirements.length > 4000) e.requirements = "Please keep requirements under 4,000 characters.";
  for (const k of ["company", "location", "projectType", "capacity", "timeline"] as const) {
    if (f[k].length > 200) e[k] = "This field is too long.";
  }
  if (f.consent !== "yes") e.consent = "Please confirm you agree to us processing your enquiry.";
  return e;
}

export function validateFile(file: { name: string; size: number } | null | undefined): string | undefined {
  if (!file || file.size === 0) return undefined;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) return `Allowed file types: ${ALLOWED_EXTENSIONS.join(", ").toUpperCase()}.`;
  if (file.size > MAX_FILE_BYTES) return "File must be 10 MB or smaller.";
  return undefined;
}
