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

## BUILD REPORT — October 2 continuation

Implemented the remaining code changes for the bounded, inspectable graph:

- Session-wide maximum of 60 nodes and 100 edges, including the initial graph;
  duplicate/cycle protection retains distinct relationship assertions and focus.
- Expansion stops at capacity, with a reset control and loading/status/error text.
- Source evidence is loaded in bounded batches (100 entries per neighborhood)
  and exposes source/document links, stance, locator, and explicit omissions.
- Relationships with an endpoint hidden by public entity visibility are omitted;
  evidence without a visible document and source is omitted. HTTP(S) external
  document URLs only; rejected relationships remain excluded.
- Expansion responses are private/no-store because the server client reads cookies.
- Public RLS remains authoritative. Existing policies publish supported/disputed
  lineage; candidate status is retained by the client when supplied, but this
  change does not publish candidate database records or change any policies.
- Vitest resolves the app's @ alias for real endpoint/component tests.

Acceptance checks:

- PASS: 92 automated tests across 7 files, including 21 added lineage tests.
- PASS: TypeScript, ESLint, production build, and diff whitespace checks.
- PASS: tests cover repeated expansion bounds, cycles/duplicates, rejected/dangling
  relationships, evidence stance/locators, hidden-record projection, unsafe URLs,
  evidence/edge truncation, query failure propagation, API validation/status/cache,
  and server-rendered semantic evidence links and native keyboard controls.
- NOT VERIFIED: live Supabase/RLS integration. Data tests use an in-memory query
  fixture and simulate hidden query results; they do not prove deployed policies.
- NOT VERIFIED: desktop/mobile browser appearance or keyboard interaction.
  Playwright was available but no browser executable was installed; its browser
  download returned invalid archives. The temporary UI fixture was removed.
- OPEN: remote CI's previous run for ba7fe201 failed at startup; no application
  result from that run. Check the new head independently after publication.

A stale local build cache was moved aside after a Turbopack cache panic. The clean
production build passed. No production data, schema, or publication was changed.

Acceptance gate: FAIL / incomplete pending remote CI, live integration, and
browser verification. Keep PR #5 draft and do not begin Slice 5.

## BUILD REPORT — October 2 verification completed

### CI recovery

The startup annotation identified the concrete cause: repository policy accepts
only actions from repositories owned by diamondmind88, rejecting checkout@v4 and
setup-node@v4. The quality workflow now uses native git checkout of the triggering
SHA on ubuntu-24.04 and verifies the runner's Node.js 22. No action allowlist or
repository security setting was changed. Run 37091171742 at commit 6e85f4b3 passed
installation, TypeScript, lint, all 92 tests, and production build.

### Live database

Restored the previously paused existing CannaGraph project. Once ACTIVE_HEALTHY,
all four expected migrations were present; no migration or schema change was
needed. Earlier queries during COMING_UP returned empty metadata, so those
results were not used to alter the database.

The integration gate in supabase/tests/lineage_visibility.sql verifies anonymous
and authenticated public reads, hidden draft/rejected/candidate assertions,
evidence-to-document/source visibility, and denied canonical writes. It generates
fixture UUIDs inside a transaction, uses explicit public IDs, and rolls everything
back. The gate passed against the live database. Canonical entity, relationship,
and source counts remained zero after testing; no test record was published.

Production-runtime smoke checks passed for the real-data home, cultivar index,
search, and missing-public-record lineage API response (404).

### Browser verification

Chromium was recovered from a temporary npm-distributed browser bundle after the
standard download failed. Production-compiled checks passed at 390, 768, and
1280 pixel widths. Screenshots were visually inspected. Verified:

- No horizontal page overflow with long cultivar labels.
- Keyboard opens the semantic relationship/evidence section.
- Source links and disputed/unknown-role/confidence text are inspectable.
- Repeated expansion stops at 60 nodes; reset returns to the initial graph.
- Failed expansion renders an error and controls recover.
- No client JavaScript errors in these scenarios.

The browser component checks used a temporary route with synthetic fixtures and
intercepted expansion responses. That route was removed; production public routes
were separately checked against the real database. This is not a published-site
or real-cultivar editorial sign-off, and no cannabis facts were fabricated.

Acceptance gate: PASS for the Slice 4 implementation checks recorded above.
Ready for review; no merge or Slice 5 work performed. A populated real-cultivar
editorial review and deployment remain separate release work.
