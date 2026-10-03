import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicLineageNeighborhood } from "./public-data";
const focusId = "11111111-1111-4111-8111-111111111111";
const parentId = "22222222-2222-4222-8222-222222222222";
type Row = Record<string, unknown>;
let tables: Record<"entities" | "lineage_relationships" | "lineage_evidence" | "source_documents" | "sources", Row[]>;
let failureTable: string | null;
function client() {
  return { from(table: string) {
    let rows = [...(tables[table as keyof typeof tables] ?? [])];
    const result = () => ({data: failureTable === table ? null : rows, error: failureTable === table ? new Error("Database unavailable") : null});
    const query = {
      select() { return query; },
      eq(key: string, value: unknown) { rows = rows.filter(row => row[key] === value); return query; },
      neq(key: string, value: unknown) { rows = rows.filter(row => row[key] !== value); return query; },
      in(key: string, values: unknown[]) { rows = rows.filter(row => values.includes(row[key])); return query; },
      order(key: string) { rows.sort((a,b) => String(a[key]).localeCompare(String(b[key]))); return query; },
      limit(count: number) { rows = rows.slice(0, count); return query; },
      maybeSingle() { const r = result(); return Promise.resolve({...r, data: r.data?.[0] ?? null}); },
      then(resolve: (r: ReturnType<typeof result>) => unknown, reject?: (e: unknown) => unknown) { return Promise.resolve(result()).then(resolve, reject); }
    };
    return query;
  }};
}
beforeEach(() => {
  failureTable = null;
  tables = {
    entities: [focusId, parentId].map(id => ({id, public_id: id, canonical_name: id === focusId ? "Child" : "Parent", entity_type: "cultivar", slug: null})),
    lineage_relationships: [{id: "relationship", child_entity_id: focusId, parent_entity_id: parentId, parent_role: "unknown", status: "disputed", confidence: 0.5}],
    lineage_evidence: [{id: "evidence", lineage_relationship_id: "relationship", source_document_id: "document", stance: "contradicts", locator: "page 7"}],
    source_documents: [{id: "document", source_id: "source", title: "Original catalog", document_url: "https://example.com/catalog"}],
    sources: [{id: "source", title: "Breeder archive"}]
  };
  vi.mocked(createSupabaseServerClient).mockResolvedValue(client() as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>);
});
describe("public lineage data", () => {
  it("retains disputed status, unknown roles and inspectable evidence", async () => {
    const result = await getPublicLineageNeighborhood(focusId);
    expect(result?.edges[0]).toMatchObject({status: "disputed", parentRole: "unknown", confidence: 0.5, evidence: [{sourceId: "source", title: "Original catalog", stance: "contradicts", locator: "page 7"}]});
  });
  it("excludes rejected relationships", async () => {
    tables.lineage_relationships[0]!.status = "rejected";
    expect((await getPublicLineageNeighborhood(focusId))?.edges).toEqual([]);
  });
  it("does not expose relationships to RLS-hidden entities", async () => {
    tables.entities = tables.entities.slice(0,1);
    expect((await getPublicLineageNeighborhood(focusId))?.edges).toEqual([]);
  });
  it("does not expose evidence when its document or source is hidden", async () => {
    tables.sources = [];
    expect((await getPublicLineageNeighborhood(focusId))?.edges[0]?.evidence).toEqual([]);
  });
  it("drops unsafe external URLs", async () => {
    tables.source_documents[0]!.document_url = "javascript:alert(1)";
    expect((await getPublicLineageNeighborhood(focusId))?.edges[0]?.evidence[0]?.url).toBeNull();
  });
  it("bounds the evidence payload and reports omitted entries", async () => {
    tables.lineage_evidence = Array.from({length: 105}, (_, i) => ({...tables.lineage_evidence[0], id: `e${String(i).padStart(3, "0")}`}));
    const result = await getPublicLineageNeighborhood(focusId);
    expect(result?.edges[0]?.evidence).toHaveLength(100);
    expect(result?.evidenceTruncated).toBe(true);
  });
  it("bounds edges and retains truncation", async () => {
    tables.lineage_relationships = Array.from({length: 25}, (_, i) => ({...tables.lineage_relationships[0], id: `r${i}`}));
    const result = await getPublicLineageNeighborhood(focusId, 1000);
    expect(result?.edges).toHaveLength(20);
    expect(result?.truncated).toBe(true);
  });
  it("fails rather than treating a database error as no evidence", async () => {
    failureTable = "lineage_evidence";
    await expect(getPublicLineageNeighborhood(focusId)).rejects.toThrow("Database unavailable");
  });
  it("returns no public record for invalid or hidden focus identifiers", async () => {
    expect(await getPublicLineageNeighborhood("invalid")).toBeNull();
    tables.entities = [];
    expect(await getPublicLineageNeighborhood(focusId)).toBeNull();
  });
});
