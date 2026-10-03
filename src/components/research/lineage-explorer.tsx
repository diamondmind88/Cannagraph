"use client";
import { useCallback,useMemo,useState,useRef } from "react";
import { Background,Controls,MarkerType,ReactFlow,type Edge,type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MAX_GRAPH_NODES, MAX_GRAPH_EDGES, mergeLineageNeighborhood, type LineageNode as GraphEntity, type LineageEdge as GraphEdge, type LineageNeighborhood } from "@/lib/lineage-graph";
export type { LineageNeighborhood } from "@/lib/lineage-graph";
const label=(v:string)=>v.replaceAll("_"," ");
function positioned(nodes:GraphEntity[],edges:GraphEdge[],focusId:string):Node[]{const parents=new Set(edges.filter(e=>e.childEntityId===focusId).map(e=>e.parentEntityId));const children=new Set(edges.filter(e=>e.parentEntityId===focusId).map(e=>e.childEntityId));let p=0,c=0,o=0;return nodes.map(n=>{let x=260,y=180;if(n.id!==focusId&&parents.has(n.id)){x=p++*240;y=20}else if(n.id!==focusId&&children.has(n.id)){x=c++*240;y=340}else if(n.id!==focusId){x=o++*240;y=520}return{id:n.id,position:{x,y},data:{label:n.canonicalName},style:{width:190,borderRadius:12,border:"1px solid var(--line-strong)",background:"var(--surface)",color:"var(--foreground)",padding:12,fontSize:13,fontWeight:n.id===focusId?700:500}}})}
function flowEdges(edges:GraphEdge[]):Edge[]{return edges.map(e=>({id:e.id,source:e.parentEntityId,target:e.childEntityId,label:`${label(e.parentRole)} · ${label(e.status)}`,markerEnd:{type:MarkerType.ArrowClosed},animated:e.status==="disputed",style:{strokeDasharray:e.status==="candidate"?"6 4":undefined},labelStyle:{fontSize:10}}))}
export function LineageExplorer({ initial }: { initial: LineageNeighborhood }) {
  const [graph, setGraph] = useState(() => mergeLineageNeighborhood(initial, initial));
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const nodes = useMemo(() => positioned(graph.nodes, graph.edges, initial.focusId), [graph, initial.focusId]);
  const edges = useMemo(() => flowEdges(graph.edges), [graph.edges]);
  const atCapacity = graph.nodes.length >= MAX_GRAPH_NODES || graph.edges.length >= MAX_GRAPH_EDGES;
  const expand = useCallback(async (id: string) => {
    if (inFlight.current || atCapacity) return;
    inFlight.current = true;
    setBusy(id);
    setError(null);
    try {
      const response = await fetch(`/api/lineage/${id}?limit=12`);
      if (!response.ok) throw new Error("Expansion could not be loaded.");
      const next: LineageNeighborhood = await response.json();
      setGraph(current => mergeLineageNeighborhood(current, next));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Expansion could not be loaded.");
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  }, [atCapacity]);
  const reset = () => { setGraph(mergeLineageNeighborhood(initial, initial)); setError(null); };
  return <div className="space-y-4">
    <div className="h-[32rem] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]" aria-label="Interactive cultivar lineage graph">
      <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.25} maxZoom={1.8} nodesDraggable={false} nodesConnectable={false}>
        <Background gap={24}/><Controls showInteractive={false}/>
      </ReactFlow>
    </div>
    <p role="status" className="text-xs text-[var(--muted)]">{graph.nodes.length} cultivars · {graph.edges.length} relationships{busy ? " · Loading neighborhood…" : ""}</p>
    <div className="flex flex-wrap gap-2">
      {graph.nodes.map(node => <button key={node.id} type="button" disabled={busy !== null || atCapacity} onClick={() => expand(node.id)} className="max-w-full break-words rounded-full border border-[var(--line-strong)] px-3 py-2 text-xs disabled:opacity-50">{busy === node.id ? "Loading…" : `Expand ${node.canonicalName}`}</button>)}
      <button type="button" disabled={busy !== null} onClick={reset} className="max-w-full break-words rounded-full border border-[var(--line-strong)] px-3 py-2 text-xs disabled:opacity-50">Reset to starting cultivar</button>
    </div>
    {atCapacity ? <p className="text-xs text-[var(--muted)]">This view has reached its size limit. Reset to explore another path.</p> : graph.truncated && <p className="text-xs text-[var(--muted)]">Some relationships are outside this small neighborhood. Expand a cultivar to explore further.</p>}
    {graph.evidenceTruncated && <p className="text-xs text-[var(--muted)]">Only the first 100 evidence entries per neighborhood are shown. Open the cultivar research page for further evidence.</p>}
    {error && <p role="alert" className="text-sm text-[var(--muted)]">{error}</p>}
    <details className="rounded-xl border border-[var(--line)] p-5">
      <summary className="cursor-pointer font-semibold">Lineage relationships and source evidence</summary>
      {graph.edges.length === 0 ? <p className="mt-4 text-sm text-[var(--muted)]">No public lineage relationships are available in this view.</p> : <ul className="mt-4 space-y-4">
        {graph.edges.map(edge => {
          const parent = graph.nodes.find(node => node.id === edge.parentEntityId);
          const child = graph.nodes.find(node => node.id === edge.childEntityId);
          return <li key={edge.id} className="break-words text-sm">
            <strong>{parent?.canonicalName}</strong> → {child?.canonicalName} <span className="text-[var(--muted)]">({label(edge.parentRole)}, {label(edge.status)}{edge.confidence === null ? "" : `, evidence confidence ${Math.round(edge.confidence * 100)}%`})</span>
            {edge.evidence.length === 0 ? <p className="mt-1 text-xs text-[var(--muted)]">No public source evidence is available for this relationship in this view.</p> : <ul className="mt-2 space-y-2">
              {edge.evidence.map(item => <li key={item.id}>
                <a href={`/sources/${item.sourceId}`} className="underline underline-offset-4">{item.title}</a>
                <span className="text-[var(--muted)]"> · {label(item.stance)}{item.locator ? ` · ${item.locator}` : ""}</span>
                {item.url && <> · <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Original document</a></>}
              </li>)}
            </ul>}
          </li>;
        })}
      </ul>}
    </details>
  </div>;
}
