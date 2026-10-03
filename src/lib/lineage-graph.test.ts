import { describe, expect, it } from "vitest";
import { MAX_GRAPH_EDGES, MAX_GRAPH_NODES, mergeLineageNeighborhood, type LineageNeighborhood, type LineageEdge } from "./lineage-graph";
const node = (id: string) => ({ id, canonicalName: id, publicId: id, entityType: "cultivar", slug: null });
const edge = (id: string, parent = "focus", child = "child", status = "supported"): LineageEdge => ({ id, parentEntityId: parent, childEntityId: child, parentRole: "unknown", status, confidence: null, evidence: [] });
const graph = (ids: string[], edges: LineageEdge[] = []): LineageNeighborhood => ({ focusId: "focus", nodes: ids.map(node), edges, truncated: false, evidenceTruncated: false });
describe("bounded lineage sessions", () => {
  it("retains the focal cultivar when input ordering exceeds capacity", () => {
    const result = mergeLineageNeighborhood(graph(["focus"]), graph(Array.from({length: 90}, (_, i) => `n${i}`)));
    expect(result.nodes).toHaveLength(MAX_GRAPH_NODES);
    expect(result.nodes[0]?.id).toBe("focus");
    expect(result.truncated).toBe(true);
  });
  it("stays bounded across repeated cyclic expansions", () => {
    let current = graph(["focus"]);
    for(let i = 0; i < 300; i++) current = mergeLineageNeighborhood(current, graph(["focus", `n${i}`], [edge(`e${i}`, "focus", `n${i}`)]));
    expect(current.nodes).toHaveLength(MAX_GRAPH_NODES);
    expect(current.edges.length).toBeLessThanOrEqual(MAX_GRAPH_EDGES);
    const ids = new Set(current.nodes.map(n => n.id));
    expect(current.edges.every(e => ids.has(e.parentEntityId) && ids.has(e.childEntityId))).toBe(true);
  });
  it("caps edges independently of node count", () => {
    const result = mergeLineageNeighborhood(graph(["focus", "child"]), graph(["focus", "child"], Array.from({length: 130}, (_, i) => edge(`e${i}`))));
    expect(result.edges).toHaveLength(MAX_GRAPH_EDGES);
    expect(result.truncated).toBe(true);
  });
  it("deduplicates cycles while retaining alternate claims and exact parent roles", () => {
    const candidate = {...edge("a", "focus", "child", "candidate"), parentRole: "seed_parent"};
    const disputed = {...edge("b", "child", "focus", "disputed"), parentRole: "pollen_parent"};
    const first = graph(["focus", "child"], [candidate, disputed]);
    const result = mergeLineageNeighborhood(first, first);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toEqual([candidate, disputed]);
  });
  it("drops rejected and dangling edges", () => {
    const result = mergeLineageNeighborhood(graph(["focus", "child"]), graph([], [edge("rejected", "focus", "child", "rejected"), edge("hidden", "focus", "hidden")]));
    expect(result.edges).toEqual([]);
  });
  it("retains source evidence and independent truncation notices", () => {
    const claim = {...edge("a"), evidence: [{id: "evidence", sourceId: "source", documentId: "doc", title: "Contemporary account", stance: "contradicts", locator: "page 4", url: null}]};
    const next = {...graph(["focus", "child"], [claim]), evidenceTruncated: true};
    const result = mergeLineageNeighborhood(graph(["focus"]), next);
    expect(result.edges[0]?.evidence[0]?.stance).toBe("contradicts");
    expect(result.evidenceTruncated).toBe(true);
  });
});
