import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LineageExplorer } from "@/components/research/lineage-explorer";
import type { LineageNeighborhood } from "./lineage-graph";
const initial: LineageNeighborhood = {focusId:"child",nodes:[{id:"child",canonicalName:"Child cultivar",publicId:"child",entityType:"cultivar",slug:null},{id:"parent",canonicalName:"Parent cultivar",publicId:"parent",entityType:"cultivar",slug:null}],edges:[{id:"r",parentEntityId:"parent",childEntityId:"child",parentRole:"unknown",status:"disputed",confidence:0.5,evidence:[{id:"e",sourceId:"source",documentId:"doc",title:"Contemporary catalog",stance:"contradicts",locator:"page 4",url:"https://example.com/catalog"}]}],truncated:false,evidenceTruncated:false};
describe("lineage accessible markup", () => {
  it("exposes relationship labels, source links and keyboard-native controls", () => {
    const html=renderToStaticMarkup(createElement(LineageExplorer,{initial}));
    expect(html).toContain('<summary class="cursor-pointer font-semibold">Lineage relationships and source evidence</summary>');
    expect(html).toContain('href="/sources/source"');
    expect(html).toContain('href="https://example.com/catalog"');
    expect(html).toContain("contradicts");
    expect(html).toContain("unknown, disputed");
    expect(html).toContain("evidence confidence 50%");
    expect(html).toContain('type="button"');
    expect(html).toContain("Reset to starting cultivar");
  });
  it("labels missing evidence without asserting support", () => {
    const data={...initial,edges:initial.edges.map(e=>({...e,evidence:[]}))};
    expect(renderToStaticMarkup(createElement(LineageExplorer,{initial:data}))).toContain("No public source evidence is available");
  });
});
