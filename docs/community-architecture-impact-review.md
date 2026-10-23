# Community workstream: architecture impact review

## Decision and scope

The user requested a separate community/product workstream and authorized continuation on October 4, 2026. This review precedes a bounded browser-local prototype, rather than implementing the master handoff's complete social stack ahead of authentication. The prototype validates review and journal workflows; it is not acceptance of Slices 5, 15, or 16A and must not be described as a deployed private account service.

Reviewed baseline: `4c9f6a685704c9f2b1d78b3df4b10d1c1e6371e9` (merged cultivar research page). No root or nested AGENTS.md was present in that checkout. The master handoff's architecture-impact gate, canonical hierarchy, privacy requirements, and numbered slices informed this boundary.

## Existing systems affected

Public navigation gains Reviews and Journals destinations. The existing `getPublicEntities` read boundary supplies published cultivar references. Canonical IDs, research loaders, lineage, aliases, claim evidence, source provenance, database types, migrations, and existing publication policies remain authoritative.

Existing `community_submissions`, `submission_entity_links`, and `submission_evidence` model research intake. They are not a sensory-review or grow-journal persistence API. This prototype does not overload those tables or write user observations into claims. The repository has no account login routes, sensory tables, grow-run tables, journal tables, or media ingestion service.

## Relationship map

| Relationship | Ownership and meaning |
| --- | --- |
| User → organization membership → organization/breeder attribution | Existing organizational model; membership does not verify an observation |
| Cultivar/cut → canonical entity → names/aliases | Reuse immutable entity IDs; reported labels remain separate from confirmed identity |
| User → grow → specimen → cultivar/cut | Future authenticated ownership; observations describe a specific specimen/run |
| Grow → batch → sensory review / hash outcome | Future grow/batch scope; never generalize to every plant bearing the name |
| Grow → journal → dated entry → media/environment event | Future journal schema; current notebook is a local draft only |
| Submission → subject entity + evidence → reviewed candidate claim | Existing intake boundary, followed by a distinct canonical review/write workflow |
| Claim → evidence → source document → source | Existing research provenance; community popularity cannot establish confidence |

The prototype's selected entity ID is a reference to an existing published cultivar. A manually entered cut or cultivar label is a contributor report, not a new canonical entity, identity decision, or verification badge. Unknown identification must remain possible.

## Schema and migration plan

No schema additions or migrations are required for this prototype. Do not duplicate cultivars, cuts, users, organizations, or source records. Preserve all existing migrations.

After authentication, propose additive sensory review and grow/specimen/batch/journal/event/media schemas matching the master handoff. Reuse existing submission/evidence references for correction proposals and review decisions. Defer follows, reputation, feeds, public sharing, consultations, lab integration, and washability writes until their own bounded slices. Browser-local draft migration into an account must require explicit user selection and server validation, never silently upload local contents.

## Authorization and privacy model

Browser persistence is scoped to the current browser origin and is accessible to anyone using that browser profile; it is not encryption, account isolation, or a backup service. Explain this in the product, provide export and deletion, and report failed saves without losing the visible draft. No publish toggle or cloud-security claim is appropriate.

For future cloud tables: authenticated owner-scoped INSERT/SELECT/UPDATE/DELETE, owner checks on both existing and resulting rows, explicit grants and RLS, and separate moderation privileges. A journal entry's effective visibility must not exceed its parent journal's permission. Private storage objects require matching ownership and selective-sharing policies. Public derivatives require location-metadata removal and rights checks before publication. Test allow/deny access with another account and an anonymous session. Authentication and authorization remain independent of contributor verification or billing.

Supabase policy reference: https://supabase.com/docs/guides/database/postgres/row-level-security . This review does not modify policies or claim that proposed policies have passed database tests.

## Provenance and risks

Keep aroma/flavor prose, product format, batch/producer context, review date, commercial disclosure, reported labels, and resolved entity references together. Journal dates describe observation time, not upload time. Hypotheses and firsthand reports remain distinct from reviewed research facts. Failed and inconclusive outcomes should be recordable.

Critical risks: accidental canonical writes, duplicate identity records, unverifiable cut labels, shared-device disclosure, storage-quota failures, stale/invalid draft data, false publishing affordances, and photo metadata leakage. The prototype avoids public uploads and remote writes; it must reject malformed drafts and make persistence limitations explicit. Public cloud release is blocked until authentication, ownership policies, media handling, moderation, and privacy tests are implemented.

## Exact foundation recommendations

Keep Slice 1's canonical and intake model as the sole research boundary. Do not introduce a parallel strain catalog. Add grow/batch/sensory tables only in a reviewed migration for their relevant slice. Use stable entity references, allow unknown labels, preserve sources and explicit reviewer decisions, and never turn local/community observations into canonical facts automatically.

## Acceptance gate

Prototype acceptance requires typecheck, lint, tests, production build, draft persistence/recovery and error handling, unknown identity handling, export/deletion, responsive labeled forms, and an explicit local-only notice. Passing this gate does not approve cloud publication or complete the master handoff's social acceptance gates. Final validation results are recorded in the implementation build report.
