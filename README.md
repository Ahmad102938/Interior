# ADIDEV — Integrated Engineering & Infrastructure Solutions

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Three.js / React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000 — pending content visible with PENDING badges
npm run build && npm start   # production — pending content hidden
```

## Structure

- `src/components/experience/` — the cinematic 3D hero. One master progress value
  (`lib/animation/scroll.ts`) drives camera, scene mood, story track and chapter rail.
  - `scenes/` — Telecom, Solar, Civil, Interior environments (procedural; replaceable with GLB)
  - `models/` — shared PBR material library, procedural textures, instancing primitives
  - `ExperienceFallback.tsx` — mobile / reduced-motion / no-WebGL story
- `src/config/experience.ts` — camera keyframes, zone layout, atmospheres, quality tiers
- `src/config/theme.ts` + `src/app/globals.css` — brand tokens and vertical colour mapping
- `src/data/` — all business content, each fact with a verification status
- `src/app/api/enquiry/route.ts` — validated enquiry intake (needs `ENQUIRY_WEBHOOK_URL`)
- `docs/CONTENT_VERIFICATION.md` — what is pending management approval

## Regenerating posters

`public/images/posters/chapter-{0..4}.jpg` are stills of the 3D scenes used for the
loading frame, mobile/fallback story and interim vertical imagery. Re-render them after
changing the scenes or camera path.
