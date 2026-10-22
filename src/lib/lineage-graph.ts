export type LineageNode = { id: string; publicId: string; canonicalName: string; slug: string | null; entityType: string };
export type LineageEvidence = { id: string; sourceId: string; documentId: string; title: string; stance: string; locator: string | null; url: string | null };
export type LineageEdge = { id: string; childEntityId: string; parentEntityId: string; parentRole: string; status: string; confidence: number | null; evidence: LineageEvidence[] };
export type LineageNeighborhood = { focusId: string; nodes: LineageNode[]; edges: LineageEdge[]; truncated: boolean; evidenceTruncated: boolean };
export const MAX_GRAPH_NODES = 60;
export const MAX_GRAPH_EDGES = 100;

// One-hop requests can accumulate across many expansions. Enforce session bounds
// as well, preserving the current focus and relationships already in the view.
export function mergeLineageNeighborhood(current: LineageNeighborhood, next: LineageNeighborhood): LineageNeighborhood {
  const allNodes = [...new Map([...current.nodes, ...next.nodes].map(node => [node.id, node])).values()];
  const focus = allNodes.find(node => node.id === current.focusId);
  const nodes = [...(focus ? [focus] : []), ...allNodes.filter(node => node.id !== current.focusId)].slice(0, MAX_GRAPH_NODES);
  const ids = new Set(nodes.map(node => node.id));
  const allEdges = [...new Map([...current.edges, ...next.edges].map(edge => [edge.id, edge])).values()];
  const edges = allEdges.filter(edge => edge.status !== "rejected" && ids.has(edge.parentEntityId) && ids.has(edge.childEntityId)).slice(0, MAX_GRAPH_EDGES);
  return { focusId: current.focusId, nodes, edges, truncated: current.truncated || next.truncated || allNodes.length > nodes.length || allEdges.length > edges.length, evidenceTruncated: current.evidenceTruncated || next.evidenceTruncated };
}
