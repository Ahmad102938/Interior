# ADIDEV — Content Verification Register

Internal document. Lists every business fact the website references and its
publication status. Source of truth for statuses: the `status` field in
`src/data/*.ts` (see `src/lib/content.ts`).

| Status        | Meaning                                                                 | Public site |
| ------------- | ----------------------------------------------------------------------- | ----------- |
| `verified`    | Approved by management                                                  | Shown       |
| `provisional` | Descriptive copy from the client presentation (services, processes)     | Shown — still needs sign-off |
| `pending`     | Business fact awaiting confirmation                                     | **Hidden in production** |

Pending content is visible in `npm run dev` (with an amber **PENDING** badge) so
layouts can be reviewed. Production builds hide it automatically. Override with
`NEXT_PUBLIC_SHOW_UNVERIFIED=true|false`.

To publish a fact: replace the placeholder value in `src/data/` and set
`status: "verified"`.

## Blocking items (pending — hidden)

| Item | File | Note |
| --- | --- | --- |
| **Establishment year** | `data/company.ts` → `company.established` | **Conflict:** draft says **2014**, existing public About page says **2017**. Management must decide. |
| Legal company name | `data/company.ts` | |
| Years of operation | `data/company.ts` → `metrics` | Depends on establishment year |
| States with project presence | `data/company.ts` → `metrics` | Figma draft shows "18 States" — unverified |
| Telecom sites supported | `data/company.ts` → `metrics` | Figma draft shows "1,000+ LTE" — unverified |
| Team strength | `data/company.ts` → `metrics` | |
| Company timeline / milestones | `data/history.ts` | All five entries are structural placeholders |
| Corporate & regional office addresses | `data/company.ts` → `contact` | |
| Official phone & business email | `data/company.ts` → `contact` | |
| Social media URLs | `data/company.ts` → `contact.social` | |
| Founder / director name, designation, bio, portrait | `data/capabilities.ts` → `leadership` | |
| All project case studies | `data/projects.ts` | Six category placeholders — no real project data supplied. Draft slugs return 404 in production. |
| Client / partner logos (8 slots) | `data/capabilities.ts` → `clientLogos` | Written permission required |
| Testimonials | `data/capabilities.ts` → `testimonials` | Empty — genuine, approved quotes only |
| Certifications / registrations / licences | `data/capabilities.ts` → `certifications` | Issuer, scope and validity required |
| Equipment & resource ownership model | `data/capabilities.ts` → `equipment` | Owned / leased / hired / partner-provided per item |
| Career openings | `app/careers/page.tsx` → `openings` | Current roles only |
| Downloads (company profile, brochures) | `app/resources/page.tsx` → `downloads` | Approved PDFs only |

## Provisional copy (shown — needs sign-off)

- Positioning, tagline, hero introduction, overview, vision, mission, core values (`data/company.ts`)
- Service descriptions, service lists and process flows for all four verticals (`data/verticals.ts`)
- Capabilities, execution stages, quality / HSE / sustainability practices, "Why Adidev", team functions, industries, FAQs (`data/capabilities.ts`)
- Privacy Policy and Terms (`app/privacy-policy`, `app/terms`) — generic drafts, **require legal review**

## Required before launch (not content facts)

- `ENQUIRY_WEBHOOK_URL` — management-approved enquiry recipient (CRM / email service). Until set, the form returns an honest "not sent" message (HTTP 503).
- Original logo (SVG/PNG) — `components/ui/Logo.tsx` is a typographic placeholder.
- Project photography for each vertical — current imagery is labelled "Illustrative visualisation" (renders of the site's own 3D scenes).
- Optional: client CAD / GLB models to replace procedural scenes in `components/experience/scenes/` (drop files in `public/models/<vertical>/`).
