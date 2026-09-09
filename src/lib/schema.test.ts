import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationDirectory = join(process.cwd(), "supabase", "migrations");
const migrationNames = [
  "20260909021405_canonical_core.sql",
  "20260909021422_research_and_community.sql",
  "20260909021436_rls_and_seed.sql",
  "20260909021635_security_hardening.sql",
];
const sql = migrationNames
  .map((name) => readFileSync(join(migrationDirectory, name), "utf8"))
  .join("\n");

const canonicalTables = [
  "entities",
  "entity_names",
  "cultivars",
  "breeders",
  "cuts",
  "phenotypes",
  "traditional_populations",
  "sources",
  "source_documents",
  "claims",
  "claim_evidence",
  "lineage_relationships",
  "lineage_evidence",
  "hypotheses",
  "hypothesis_claims",
  "identity_candidates",
  "entity_merges",
  "source_registry",
  "discovery_queue",
  "research_jobs",
  "research_events",
  "organizations",
  "organization_members",
  "organization_entity_links",
  "verification_requests",
  "verification_evidence",
  "verification_events",
  "discovery_candidates",
  "community_submissions",
  "submission_entity_links",
  "submission_evidence",
  "activity_events",
];

describe("canonical database migrations", () => {
  it.each(canonicalTables)("creates %s", (table) => {
    expect(sql).toMatch(new RegExp(`create table public\\.${table}\\s*\\(`));
  });

  it.each(canonicalTables)("enables RLS on %s", (table) => {
    expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("keeps canonical writes out of client grants", () => {
    expect(sql).not.toMatch(/grant\s+(?:insert|update|delete)[^;]*on public\.(?:entities|claims|lineage_relationships)/is);
  });

  it("makes server-only table boundaries explicit", () => {
    expect(sql.match(/_client_deny on public\./g)).toHaveLength(7);
    expect(sql).toContain("revoke execute on function public.rls_auto_enable()");
  });

  it("requires evidence-bearing claims and explicit merge approval", () => {
    expect(sql).toContain("claims_exactly_one_object");
    expect(sql).toContain("approved_by uuid not null references auth.users(id)");
    expect(sql).toContain("Human-review queue only; similarity scores never merge entities automatically.");
  });
});
