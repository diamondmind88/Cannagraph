# Slice 3 — Cultivar research page

## SLICE

**Goal:** Replace the Slice 2 cultivar placeholder with a database-backed research page exposing canonical identity, aliases, research completeness, history, lineage summary, evidence overview, breeder attribution, descendants, sources, and disputed claims without inventing missing facts.

**Dependencies:** Merged Slices 0–2; canonical `entities`, `entity_names`, `cultivars`, `claims`, `claim_evidence`, `lineage_relationships`, `lineage_evidence`, `sources`, and `source_documents` tables; existing public `/cultivars/[slug]` route and server Supabase boundary.

**Schema changes:** None expected. Slice 1 already models the data required for this vertical slice. Any newly discovered schema requirement must be additive and justified before implementation.

**Routes/components:** `/cultivars/[slug]`; public research data loader(s); focused presentational components only where they reduce duplication or improve accessibility.

**Risks:** Accidentally presenting candidate/disputed data as established fact; inferring unknown parent roles or breeder attribution; collapsing aliases into identity; evidence inflation from dependent sources; N+1 queries; exposing non-public records; allowing long research text to break mobile layouts.

**Acceptance tests:**

- Uses the real canonical database; no mocked final-state research JSON.
- Canonical identity and immutable public ID remain distinct from names/aliases.
- Aliases preserve their type/status/source context.
- Unknown values render as unknown/not yet evidenced rather than being inferred.
- Supported, candidate, disputed, rejected, and superseded claims are not conflated.
- Lineage preserves explicit parent roles and disputed alternatives; no parent direction is guessed.
- Evidence links claims/lineage back to source documents and sources.
- Descendants are derived from explicit lineage relationships only.
- Research completeness is evidence-aware and is not represented as the later Slice 17 versioned scoring system.
- Public browsing remains login-free and respects existing RLS/publication boundaries.
- Loading, empty, error, not-found, long-text, mobile, keyboard, and semantic accessibility behavior are verified.
- Strict TypeScript, ESLint, automated tests, production build, and migration verification pass.

## Guardrails

This slice follows `Cannagraph_Master_Build_Prompt_Client_Handoff_Gregory_Michael_Donzuso_UPDATED (1).pdf` as the governing implementation contract. Work must remain bounded to Slice 3. Do not begin the interactive lineage graph (Slice 4), authentication, social features, ingestion, or later research systems.

At completion, append the required BUILD REPORT and acceptance quality gate result. Any acceptance-critical failure blocks merge.