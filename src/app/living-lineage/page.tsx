"use client";

import { useState } from "react";

type View = "hero" | "family";
const examples = ["Chem 91", "Original Diesel", "Sour Diesel"] as const;

export default function LivingLineagePrototype() {
  const [view, setView] = useState<View>("hero");
  const [selected, setSelected] = useState(1);
  const [activeBud, setActiveBud] = useState<number | null>(null);
  const [grown, setGrown] = useState(true);
  const name = examples[selected];
  const budPositions = [[145, 150], [240, 106], [333, 164], [198, 222], [300, 265]];
  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 35%, #223c32, #07130f 75%)", color: "#f4f5ee", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "auto" }}>
        <a href="/" style={{ color: "#b3cabb", fontSize: 13 }}>← Cannagraph archive</a>
        <p style={{ letterSpacing: 3, fontSize: 11, color: "#a8c9b0", marginTop: 28 }}>EXPERIMENTAL EXPERIENCE · DEMONSTRATION</p>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 62px)", margin: "8px 0" }}>The Living Lineage</h1>
        <p style={{ maxWidth: 600, color: "#c3d0c8", lineHeight: 1.6 }}>Explore a living visual metaphor for cannabis genetics. This interaction uses illustrative names and connections, not verified pedigree records or photorealistic 3D assets.</p>
        <a href="/living-lineage/media-review" style={{ display: "inline-block", padding: "12px 18px", border: "1px solid #9bc9a1", borderRadius: 18, color: "#e1f4dc", marginBottom: 8, marginRight: 8 }}>Review Sour Diesel media →</a>
        <a href="/living-lineage/archive" style={{ display: "inline-block", padding: "12px 18px", border: "1px solid #9bc9a1", borderRadius: 18, color: "#e1f4dc", marginBottom: 8 }}>Explore published archive →</a>
        <div role="group" aria-label="View mode" style={{ display: "flex", gap: 10, margin: "22px 0" }}>
          {(["hero", "family"] as const).map(mode => <button key={mode} type="button" aria-pressed={view === mode} onClick={() => { setView(mode); setActiveBud(null); }} style={{ padding: "12px 16px", borderRadius: 24, border: "1px solid #5b826a", background: view === mode ? "#d9edce" : "#162a20", color: view === mode ? "#152a1b" : "#e9f2e8", cursor: "pointer" }}>{mode === "hero" ? "Single plant" : "Family view"}</button>)}
        </div>
        <section aria-label="Interactive plant visualization" style={{ border: "1px solid #3c604b", borderRadius: 24, overflow: "hidden", background: "radial-gradient(ellipse at 50% 60%, #1e4330, #0a1911)", padding: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, margin: "16px 0 0" }}>{name}</h2>
          <p style={{ color: "#a8c6ac", fontSize: 13 }}>Select a glowing flower to explore</p>
          <svg viewBox="0 0 480 400" role="img" aria-label="Stylized animated cannabis plant with five selectable flower positions" style={{ width: "100%", maxWidth: view === "hero" ? 570 : 400, maxHeight: view === "hero" ? 490 : 310, transition: "max-width .5s ease", overflow: "visible" }}>
            <g style={{ transformOrigin: "240px 375px", transform: grown ? "scale(1)" : "scale(.08)", opacity: grown ? 1 : .3, transition: "transform 1.5s ease, opacity 1.5s ease" }}>
              <path d="M240 380 Q230 265 240 115 M238 300 Q175 220 145 150 M240 260 Q280 170 333 164 M239 225 Q220 155 240 106 M237 338 Q200 280 198 222 M239 328 Q283 285 300 265" fill="none" stroke="#82a86c" strokeWidth="10" strokeLinecap="round" />
              {[[172,240,-32],[296,211,28],[183,306,-20],[306,317,20],[214,177,-24],[274,144,30]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse cx="0" cy="-24" rx="15" ry="42" fill="#497f52"/><path d="M0 7 L0 -64" stroke="#b3d59b" strokeWidth="2"/></g>)}
              {budPositions.map(([x,y],i)=><g key={i} onClick={() => setActiveBud(i)} style={{ cursor: "pointer" }} role="button" aria-label={`Explore flower ${i+1}`} tabIndex={0} onKeyDown={e => { if(e.key==="Enter" || e.key===" ") { e.preventDefault(); setActiveBud(i); } }}>
                <ellipse cx={x} cy={y} rx="27" ry="38" fill={activeBud===i ? "#d1eaa1" : "#79a66a"} stroke="#c7e4a0" strokeWidth="3"/>
                <ellipse cx={x-9} cy={y+7} rx="10" ry="22" fill="#416d46"/>
                <ellipse cx={x+10} cy={y-4} rx="9" ry="25" fill="#53824e"/>
                <circle cx={x} cy={y-15} r="5" fill="#e6f6bc"/>
                <circle cx={x+13} cy={y+12} r="3" fill="#e6f6bc"/>
              </g>)}
            </g>
          </svg>
          {activeBud !== null && <div role="status" style={{ margin: "0 auto 14px", maxWidth: 440, padding: 16, borderRadius: 14, background: "#203b2b", textAlign: "left" }}><strong>{name} · Flower {activeBud+1}</strong><p style={{ color: "#c6d8c9", marginBottom: 0 }}>Prototype interaction. This will open the cultivar's real archived photos, breeder claims, source evidence and competing lineage stories once connected.</p></div>}
          {view === "family" && <p style={{ color: "#d3e7d2", fontSize: 13 }}>Family view preview · navigate between related cultivar scenes below</p>}
        </section>
        <nav aria-label="Demonstration cultivar navigation" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
          <button type="button" disabled={selected===0} onClick={()=>{setSelected(s=>Math.max(0,s-1));setActiveBud(null);}} style={{ padding: 12, borderRadius: 12, cursor: "pointer" }}>← Previous</button>
          <span style={{ textAlign: "center", fontSize: 13 }}>Example {selected+1} of {examples.length}</span>
          <button type="button" disabled={selected===examples.length-1} onClick={()=>{setSelected(s=>Math.min(examples.length-1,s+1));setActiveBud(null);}} style={{ padding: 12, borderRadius: 12, cursor: "pointer" }}>Next →</button>
        </nav>
        <button type="button" onClick={()=>{setGrown(false);window.setTimeout(()=>setGrown(true),100);}} style={{ marginTop: 20, padding: "12px 20px", border: "1px solid #8dbb8e", borderRadius: 20, background: "transparent", color: "#e7f5df", cursor: "pointer" }}>Replay growth animation</button>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#adc0b0", marginTop: 28 }}>This is an SVG interaction proof-of-concept, not the planned 3D renderer. No lineage is asserted by the navigation sequence. Production must read published Supabase records and show source-level confidence before drawing any parent/offspring edge.</p>
      </div>
    </main>
  );
}
