import type { enquiryTypes } from "@/lib/validation/enquiry";

/**
 * Enquiry / request-a-quote form (used on the homepage, /contact, /request-a-quote, /careers).
 * The enquiry-type `value`s and vertical keys must stay as they are — the server checks them.
 */
export const enquiryForm = {
  title: "Request a quote",
  requiredLabel: "Required",
  steps: ["Enquiry", "Project details", "Contact"],

  typeQuestion: "What is this about?",
  /** One card per enquiry type. `value` must stay as is — it is what the server receives. */
  routes: [
    { value: "Project", title: "Project enquiry", copy: "New projects, work packages and quotations." },
    { value: "Vendor", title: "Vendor registration", copy: "Suppliers and subcontractors seeking empanelment." },
    { value: "Partnership", title: "Business partnership", copy: "Collaboration on larger or specialised scopes." },
    { value: "General", title: "General enquiry", copy: "Anything else — we will route it to the right team." },
    { value: "Careers", title: "Careers", copy: "Send your details and attach your resume." },
  ] as { value: (typeof enquiryTypes)[number]; title: string; copy: string }[],

  fields: {
    vertical: "Business vertical",
    location: { label: "Project location", placeholder: "City, State" },
    projectType: { label: "Project type", placeholder: "e.g. warehouse, rooftop solar" },
    capacity: { label: "Area / capacity", placeholder: "e.g. 20,000 sq ft or 2 MW" },
    timeline: "Expected timeline",
    requirements: "Project requirements",
    document: { label: "Drawings / BOQ / documents (optional)", placeholder: "Attach a file — PDF, DOC, XLS, DWG, JPG or PNG, up to 10 MB" },
    fullName: "Full name",
    company: "Company / organisation",
    email: "Official email",
    phone: "Mobile number",
    selectPlaceholder: "Select…",
    /** "Expected timeline" dropdown. */
    timelineOptions: ["Immediate", "Within 3 months", "3–6 months", "6–12 months", "Not yet decided"],
    /** "Business vertical" dropdown labels (keys are fixed). */
    verticalLabels: {
      telecom: "Telecom Infrastructure",
      solar: "Solar & Renewable Energy",
      civil: "Civil Construction & Infrastructure",
      interiors: "Commercial Interior & Fit-Out",
      other: "Other",
    } as Record<string, string>,
  },

  consent: {
    before: "I agree that Adidev may use these details to respond to my enquiry, as described in the",
    linkLabel: "privacy policy",
    linkHref: "/privacy-policy",
    after: ". Please do not upload confidential drawings unless required.",
  },

  buttons: { back: "Back", continue: "Continue", submit: "Submit enquiry", sending: "Submitting…" },

  success: {
    title: "Enquiry received.",
    copy: "Our team will review your enquiry and contact you regarding the project requirements.",
  },
  /** Messages shown under fields when something is missing or wrong (also used by the server). */
  validation: {
    fullName: "Please enter your full name.",
    nameTooLong: "Name is too long.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid contact number.",
    enquiryType: "Please choose an enquiry type.",
    vertical: "Please choose a business vertical.",
    location: "Please enter the project location.",
    requirementsShort: "Please describe your requirements (at least 10 characters).",
    requirementsLong: "Please keep requirements under 4,000 characters.",
    tooLong: "This field is too long.",
    consent: "Please confirm you agree to us processing your enquiry.",
    fileTooBig: "File must be 10 MB or smaller.",
    fileType: "Allowed file types:",
  },
  errors: {
    generic: "Please correct the highlighted fields.",
    network: "Network error — your enquiry has not been sent. Please try again.",
  },
};
