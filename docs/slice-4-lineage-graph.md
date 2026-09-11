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