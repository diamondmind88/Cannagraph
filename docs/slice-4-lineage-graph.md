# Slice 4 — Lineage graph

## SLICE

**Goal:** Add interactive, evidence-aware ancestor/descendant exploration to the public cultivar research experience using React Flow / @xyflow/react, while loading lineage incrementally and never rendering an uncontrolled entire graph.

**Dependencies:** Merged Slices 0–3; canonical `entities`, `lineage_relationships`, and `lineage_evidence`; existing public cultivar route and server-side Supabase boundary.

**Schema changes:** None expected. Existing lineage indexes and canonical relationship records must be reused. Any schema change must be additive and justified by a measured requirement.

**Routes/components:** `/cultivars/[slug]` graph section; bounded public lineage data endpoint/server action; client graph explorer; accessible non-visual lineage alternative.

**Risks:** unbounded traversal, cycles, rejected edges leaking into normal exploration, disputed alternatives disappearing, excessive data shipped to the browser, inaccessible canvas-only controls, accidental parent-direction inference, N+1 expansion queries.

**Acceptance tests:**

- Uses React Flow / @xyflow/react as required by the master build.
- Ancestors and descendants can be explored interactively.
- Initial graph is bounded to the focal cultivar and a small neighborhood.
- Further graph data loads incrementally on explicit expansion.
- Every expansion has hard node/edge/depth limits.
- Rejected lineage edges are excluded from normal public traversal.
- Supported, candidate, and disputed lineage remain distinguishable without relying on color alone.
- Parent roles are preserved exactly; unknown direction is never invented.
- Cycle/duplicate protection prevents runaway traversal and duplicate nodes.
- Public browsing remains login-free and service-role credentials never reach browser code.
- Graph has keyboard-operable controls and a semantic/list alternative where practical.
- Loading, empty, error, mobile, tablet, and long-name states are verified.
- No separate graph database or duplicate lineage architecture is introduced.
- Strict TypeScript, lint, automated tests, production build, migration/RLS verification, and regression checks pass.

## Guardrails

The UPDATED Cannagraph Master Build PDF is the governing contract. Slice 4 is limited to interactive lineage exploration. Do not begin Slice 5 authentication or any later slice. The graph must be incrementally loaded and bounded at all times.

At completion append the required BUILD REPORT and PASS/FAIL acceptance checklist. Any acceptance-critical failure blocks merge.
## BUILD REPORT — October 2, 2026

Resumed draft PR #5 without advancing to another slice. Synchronized the lockfile
with pinned `@xyflow/react` 12.8.6, mapped non-supported/non-disputed badges to the
existing `unresolved` tone, and fixed nullable-result narrowing in public research
queries. No schema, RLS, publication, or credential changes were made.

Validation against this branch:

- PASS: clean dependency installation (`npm ci --ignore-scripts`).
- PASS: strict TypeScript.
- PASS: ESLint.
- PASS: existing automated suite, 71 tests across 3 files.
- PASS: production build, including the lineage endpoint and cultivar route.
- PASS: whitespace/diff checks.
- NOT VERIFIED: hosted desktop/mobile/keyboard graph inspection and live database/RLS integration.
- NOT VERIFIED: lineage-specific acceptance coverage; the existing suite does not demonstrate all graph behaviors.
- OPEN: the client accumulates neighborhoods without a total-session node/edge cap; per-request bounds alone do not satisfy bounded-at-all-times exploration.
- OPEN: graph relationships carry status and confidence but no directly inspectable source evidence in the graph payload.
- OPEN: GitHub Actions previously failed at startup with zero jobs; runner cause is unconfirmed and remote checks must execute.

Acceptance gate: FAIL / incomplete. Keep this PR draft; do not merge or begin Slice 5.
