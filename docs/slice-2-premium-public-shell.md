# Slice 2 — Premium public shell

## Routes

- `/` — live archive totals, recent published cultivars, and primary search
- `/search` — canonical-name, public-ID, and supported-alias search
- `/cultivars` — published cultivar index
- `/cultivars/[slug]` — canonical cultivar shell
- `/breeders/[slug]` — canonical breeder shell
- `/sources/[id]` — visible source and captured-document record

## Data contract

Every route reads the Slice 1 PostgreSQL model through the typed Supabase server client. Row-level
security remains the publication boundary. The UI contains no temporary cultivar, breeder, source,
or lineage JSON. Because no canonical records are published yet, the current application correctly
renders evidence-aware empty states.

Search treats names as labels rather than identities. It queries canonical names, stable public IDs,
and supported aliases independently, then deduplicates by canonical entity UUID. User search text is
length-bounded and is never interpolated into a PostgREST logical expression.

## UI direction

The public shell uses warm archival surfaces, restrained evergreen evidence color, strong typography,
document-like rules, generous spacing, and dense record rows. It intentionally avoids neon cannabis
green, leaf motifs, dispensary cards, novelty type, noisy gradients, and login friction.

## Acceptance evidence

- All required routes are present and dynamic database reads compile.
- Loading, empty, not-found, and error states are implemented.
- Navigation, search forms, headings, labels, and focus states use semantic keyboard-accessible markup.
- Responsive layouts cover mobile, tablet, and desktop breakpoints without fixed content widths.
- TypeScript, ESLint, Vitest, and the Next.js production build pass.
- Visual cloud-browser inspection was attempted, but that browser cannot connect to the local container
  preview. This environment limitation should be resolved with a hosted preview before final visual sign-off.
