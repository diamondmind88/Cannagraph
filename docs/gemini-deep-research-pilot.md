# Gemini Deep Research pilot — CannaGraph

Status: configuration proposal; not activated. No database writes or paid Gemini jobs.

## Prerequisites
1. In Google AI Studio, create a Gemini API key and confirm API billing and Deep Research availability.
2. In GitHub repository Settings → Secrets and variables → Actions, add **GEMINI_API_KEY** as a repository secret. Never commit or paste the key.
3. Review current Gemini Deep Research API documentation for the supported agent ID, Interactions API request/polling formats, pricing, and job limits before implementation.
4. Verify Supabase staging schema and existing research_jobs lifecycle before connecting any worker.

## Pilot scope
Start with 2 jobs of up to 10 related cultivars each, max 2 concurrent jobs, explicit spending cap, no publication. Initial names: Original Diesel, East Coast Sour Diesel, Albany Sour Diesel, Giesel, Superdawg, Snowdog, Chem 91, Chem D, Chem 4, 56 Day Headband.

## Pipeline
- Queue source: existing Supabase research_jobs, without modifying schema or records until migration review.
- Coordinator: durable job ID, idempotency key, retries with exponential backoff, max attempts, timestamps, and checkpoints.
- Research: Gemini Deep Research produces cited reports, preserving contradictory accounts and original testimony.
- Extraction: separate structured-output Gemini model converts reports to JSON; validate JSON Schema and claim/source IDs.
- Citation audit: check URLs resolve and source text actually supports the attributed claims. Never equate repeated stories with independent corroboration.
- Staging: store raw report, source snapshots/metadata, extracted JSON, citation-audit results, cost/usage and review status. Do not write canonical entities, claims, or lineage relationships automatically.
- Approval: human review before merging or publishing. Preserve alternate lineage and identity hypotheses.

## Pilot acceptance criteria
- All requested cultivar names accounted for as complete/partial/unstarted.
- Every substantive factual claim has a resolvable source reference or is explicitly unverified.
- Every source ID resolves to a bibliography entry; no fabricated URLs or dates.
- Failed/retried jobs do not duplicate records.
- Hard spending limit and cancellation controls implemented before live jobs.
- Human review of disputed identity and lineage claims.

## Next implementation
Add a server-side coordinator, JSON Schema, unit tests with mock Gemini responses, GitHub Actions workflow with manual dispatch, and a dry-run option. Run tests before any paid live job.
