# Slice 1 — Canonical database

Slice 1 establishes the PostgreSQL source of truth for identity, names, evidence-backed claims,
lineage assertions, human-reviewed identity resolution, research operations, organizations,
verification, and community intake.

## Invariants

- Every canonical identity uses a UUID relational key and a stable `CNG-<TYPE>-########` public ID.
- Names are attached labels; they are never treated as identity keys.
- Claims and lineage assertions preserve supported, disputed, rejected, and superseded states.
- Evidence records point to captured source documents, including derived-source relationships.
- Similarity candidates cannot merge entities. A merge requires a named approving user and rationale.
- Community submissions are an intake boundary and cannot directly mutate canonical records.
- Unknown values remain `NULL`; the schema does not manufacture parent roles or other missing facts.
- Research queues and jobs use idempotency keys, bounded attempts, and append-only event logs.

## Security model

RLS is enabled on every public table. Anonymous and authenticated clients can select only published
canonical knowledge and its visible provenance. Authenticated users can read their own organization
membership, verification requests, and submissions. They can create intake records through
column-limited grants and ownership policies, but receive no direct write grant on canonical or
research tables. Trusted server workflows use the server-side secret and remain outside browser code.

The `app_private` schema holds trigger helpers and is inaccessible to `anon` and `authenticated`.

## Migration order

1. `20260909021405_canonical_core.sql`
2. `20260909021422_research_and_community.sql`
3. `20260909021436_rls_and_seed.sql`
4. `20260909021635_security_hardening.sql`

The seed is intentionally conservative: PubMed begins in `review_required` state, so collection is
blocked until its current usage policy is checked by a human.

## Verification

Apply migrations to an empty or current database, then verify:

- all 32 expected public tables exist and have RLS enabled;
- no foreign-key column lacks a usable leading index;
- anonymous reads exclude draft entities and candidate claims;
- authenticated users cannot write canonical records;
- submission ownership policies prevent cross-user access;
- Supabase security and performance advisors return no schema blockers.
