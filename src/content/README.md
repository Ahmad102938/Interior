# Site content — edit here, not in components

Every heading, paragraph, button label, card and image on the site comes from
this folder. Components in `src/components` only handle layout, so you can
change content without touching them.

## Where things live

| You want to change…                                  | Edit                                   |
| ---------------------------------------------------- | -------------------------------------- |
| A page's headings, intros, buttons, section labels   | `pages/<page>.ts` (one file per page)  |
| A reused render or the vertical images               | `media.ts`                             |
| Company name, contact details                        | `company.ts`                           |
| Header/menu labels, nav links, footer                | `navigation.ts`                        |
| The four verticals (summary, highlights)             | `verticals.ts`                         |
| A service page's own copy, images and lists          | `services/<vertical>.ts`               |
| Projects / case studies (text, photos, gallery)      | `projects/<vertical>.ts`               |
| Industries (text, image, requirements)               | `industries.ts`                        |
| Capabilities, execution stages, certifications, FAQs | `capabilities.ts`                      |
| Company journey timeline                             | `history.ts`                           |

### Page files (`pages/`)

| File              | Page(s)                                      |
| ----------------- | -------------------------------------------- |
| `home.ts`         | `/`: **everything on the homepage**, in order: 3D hero story + posters, metrics, section images, quality blocks, why-Adidev cards, client logos, testimonials, equipment |
| `about.ts`        | `/about` (story, values, method + headings)  |
| `services.ts`     | `/services` + labels shared by every service page |
| `projects.ts`     | `/projects`, `/projects/[slug]`              |
| `industries.ts`   | `/industries`, `/industries/[slug]`          |
| `capabilities.ts` | `/capabilities`                              |
| `quality.ts`      | `/quality-safety-compliance`                 |
| `clients.ts`      | `/clients-partners`                          |
| `careers.ts`      | `/careers` (roles, openings)                 |
| `resources.ts`    | `/resources` (downloads; FAQs are in `capabilities.ts`) |
| `contact.ts`      | `/contact`, `/request-a-quote` (page titles) |
| `forms.ts`        | The enquiry form (steps, labels, placeholders, messages) |
| `shared.ts`       | Contact section, closing CTA banner, "View all projects" tile, hero fallback |
| `legal.ts`        | `/privacy-policy`, `/terms`                  |
| `notFound.ts`     | 404 page                                     |

## Headings

Most sections use one shape:

```ts
heading: {
  eyebrow: "Business verticals",   // small label above
  title: "Four Pillars",           // first line
  accent: "of Execution.",         // second line, italic, accent colour (optional)
  intro: "Four clear service…",    // paragraph beside/below (optional)
}
```

## Adding your photos

1. Put the file in `public/images/<folder>/`, e.g. `public/images/projects/tower-site-01.jpg`.
   Use JPG/WebP, about 2000px on the long edge. Use lower-case names with no spaces.
2. Point the content at it, using a path that starts with `/images/…` (leave out `public`):

```ts
image: { src: "/images/projects/tower-site-01.jpg", alt: "Tower foundation works, Karnal", position: "50% 40%" }
```

- `alt` describes the photo, for screen readers and SEO. It is required.
- `position` (optional) sets which part of the photo stays visible when it is cropped (`"50% 50%"` is the centre).
- `caption` (optional) adds a small label over the image. Leave it out for real photos.
  The renders in `media.ts` already carry "Illustrative visualisation", so the label disappears when you swap in your own photo.

Common spots:

- **One image everywhere it's used**: change the entry in `media.ts`. For example, `verticalImages.telecom` changes the homepage panel, the About matrix and anything else that uses it.
- **Project photos**: `projects/<vertical>.ts` → `featuredImage` and `gallery: [{ phase: "before" | "during" | "after", src, alt }]`.
- **Service page hero and feature images**: `services/<vertical>.ts` → `heroImage`, plus the `image` fields inside the feature blocks.
- **Service "visual concept" slots**: `services/<vertical>.ts` → `referenceSlots`. A plain string shows a placeholder. Replace it with `{ slot: "Fibre / trenching", src: "/images/…", alt: "…" }` to show a photo.
- **Industry tiles and heroes**: `industries.ts` → `image`.
- **Homepage** (all in `pages/home.ts`):
  - `hero.posters`: hero stills shown while the 3D scene loads, and on devices without WebGL.
  - `heritage.metrics`: the stat grid. Set `status: "verified"` to publish.
  - `verticals.images`: one large photo per vertical panel.
  - `capabilities.backgroundImage` / `quality.backgroundImage`: optional dimmed photo behind the section.
  - `execution.stageImages`: optional photo per stage, e.g. `"01": { src, alt }`.
  - `quality.blocks[].image`: optional photo at the top of each quality block.
  - `clients.logos[].logo`: client logos (shown in greyscale). `clients.testimonials`: approved quotes.
  - `equipment.items[].image`: equipment photos.

## Photos on a CDN (recommended for the full photo library)

Keep the large photo library out of the repo. Upload the photos to a CDN, then:

1. In `.env.local` (and in your hosting provider's environment settings), set
   `NEXT_PUBLIC_IMAGE_CDN_URL=https://your-cdn-domain/adidev`, with no trailing slash.
2. In content files, use the `cdn()` helper from `media.ts`:

```ts
import { cdn } from "../media";
image: { src: cdn("projects/telecom/tower-01.jpg"), alt: "Tower foundation works" }
```

3. Restart the dev server or rebuild after changing the variable.

- A full URL in `src` also works, but only from the CDN host above. Next.js blocks any other domain.
- Next.js resizes each photo for the visitor's screen and serves WebP/AVIF, so a large original is never sent to phones.
  Still, upload photos at about 2000–2500px on the long edge. 20 MB camera files make the first load slow.
- Do not link Google Drive files. Drive is not an image host: links redirect, get rate-limited and break under traffic.

## Publishing rules

Business facts such as dates, metrics, clients, certifications and contacts have a
`status`: `"verified"`, `"provisional"` or `"pending"`. Anything marked `pending` is hidden in production.
Set it to `"verified"` once management approves it. See `docs/CONTENT_VERIFICATION.md`.
