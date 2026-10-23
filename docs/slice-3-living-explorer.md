# Slice 3 proposal — Living Cannabis Explorer

Status: design and acceptance contract, not a shipped feature. Keep the archival public shell intact.

## Product boundary
CannaGraph remains a historical research museum. The optional **Living Cannabis Explorer** is a calm botanical entry point into the same published records, not a replacement for search, chronology, maps, or source pages. No gamification, auto-playing sound, or fabricated history.

## First user journey
1. From an archival cultivar profile, choose **Explore connections**.
2. Open an accessible scene showing one stylized cannabis plant, with five botanical bud clusters as navigation anchors: Skunk, Haze, Chemdog, Sour Diesel, OG Kush.
3. Selecting a bud shifts focus smoothly to its family and reveals a side panel with summary, evidence status, original-source links, and **Read full history**.
4. Selecting a verified relationship highlights a path to the connected record. Unverified, disputed, and unknown relationships are visibly distinct and never drawn as confirmed lineage.
5. Return to the archive, search, or chronological atlas without losing the selected cultivar.

## Critical distinction
The plant, buds, branch layout, color and motion are **navigation metaphors**. They must never imply real morphology, botanical descent, genetic distance, chronology, or an established cross. Relationship edges are generated solely from published canonical data and their evidence status. A family label is not automatically a canonical lineage edge.

## Interaction and accessibility
- Default: static/low-motion, sound off, keyboard/touch accessible controls.
- Opt-in Zen mode: gentle movement and licensed ambient audio with pause, mute, and reduced-motion support.
- Accessible 2D/list alternative exposing identical links and source context.
- Loading, empty, error, and unsupported-WebGL states; mobile performance budget and device pixel ratio cap.
- User-controlled camera: orbit/zoom/focus/reset; no mandatory free-fly navigation.
- Search/filter and breadcrumb navigation always available.

## Data and provenance
- Supabase published canonical entities, names, lineage relationships, claims, sources, and evidence are the only factual source.
- Existing RLS/publication boundary remains enforced; no privileged keys in the browser.
- Zero canonical records currently means a truthful empty state in production. Any demo dataset must live in a clearly marked storybook/test fixture or nonproduction preview, not the public archive.
- Media ingestion is a separate reviewed pipeline; preserve original URL, photographer/owner, date, claimed subject, provenance confidence, license, usage permission, and takedown status. Do not republish scraped imagery without rights.
- Distinguish source-supported fact, firsthand account, disputed interpretation, and unknown.

## Architecture
- Next.js + React component boundary; lazy-load Three.js / React Three Fiber for the optional explorer only.
- Server-side typed read model from existing Supabase tables; a single normalized view model drives both WebGL and accessible 2D list.
- Initial scene should render five *category anchors*, not five verified cultivar records. Selecting an empty anchor explains that records are pending review.
- Keep all current archive routes unchanged. Introduce /explore as an optional route once approved.

## Acceptance gates
1. Existing archive routes and empty states unchanged.
2. Prototype loads with five clearly labeled nonfactual navigation anchors, no invented parent-child edges.
3. Click, touch, keyboard, and 2D navigation reach the same panel.
4. Published record and evidence links are sourced from canonical read model only.
5. Sound does not play until activated; pause and reduced motion work.
6. Missing WebGL still offers a functional explorer.
7. Run typecheck, lint, tests, production build, and browser accessibility/performance review before merge.

## Suggested next implementation slice
Build /explore shell, accessible 2D fallback and shared view model first; add botanical 3D layer after the factual and interaction contracts pass. Do not activate research automation or modify canonical records as part of this UI slice.
