# ADIDEV — Integrated Engineering & Infrastructure Solutions

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Three.js / React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000 — pending content visible with PENDING badges
npm run build && npm start   # production — pending content hidden
```

## Structure

- `src/components/experience/` — the cinematic 3D hero, **"From Blueprint to Building"**:
  a five-storey concrete-and-glass building transforms from a self-drawing site plan →
  gold massing model → structure & services → construction site (crane, slabs, scaffold) →
  a fly-through into the fitted-out level-2 office hall → back out to the finished building at dusk
  (lit interiors, landscape, wet reflective plaza). One master progress value
  (`lib/animation/scroll.ts`) drives camera, stage transitions, story track and rail.
  Horizontal story on desktop/tablet, vertical on phones.
  - `site/building.ts` — the building definition: single source for every stage
  - `site/BuildingSite.tsx` — the staged building; timings in `config/experience.ts → stageTimeline`
  - `site/Landscape.tsx`, `site/Backdrop.tsx` — plaza, planting, uplights; dusk sky and city
  - `site/DesignLayer.tsx`, `site/ExplodedFloors.tsx`, `site/ConstructionSite.tsx`, `site/InteriorHall.tsx`
    — design tools & context, exploded plan, working site, interior hall
  - Performance rules: a hidden warm-up renders the whole story before reveal (no shader
    compiles mid-scroll), and lights are never hidden — only dimmed — so the light count stays fixed
  - Bloom/vignette via `@react-three/postprocessing` on tablet/desktop only
  - `models/` — shared PBR material library, procedural textures, instancing primitives
  - `ExperienceFallback.tsx` — reduced-motion / Data Saver / no-WebGL story
- `src/content/pages/home.ts` — hero storyline copy and everything else on the homepage
- `src/config/experience.ts` — camera keyframes, zone layout, atmospheres, quality tiers
- `src/config/theme.ts` + `src/app/globals.css` — brand tokens and vertical colour mapping
- `src/content/` — **all site content**: page copy (`pages/*.ts`), images (`media.ts`), projects, services, industries, company facts. See `src/content/README.md` for how to edit text and add photos
- `src/app/api/enquiry/route.ts` — validated enquiry intake (needs `ENQUIRY_WEBHOOK_URL`)
- `docs/CONTENT_VERIFICATION.md` — what is pending management approval

## Regenerating posters

`public/images/posters/stage-{0..4}.jpg` are stills of the hero site at each stage, used
for the loading frame and the fallback story — re-render them after changing the scene or
camera path. `public/images/verticals/*.jpg` are interim illustrative renders for the four
vertical panels and service pages (replace with approved project photography).
