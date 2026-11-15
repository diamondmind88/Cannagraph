"use client";

import { useState } from "react";
import Link from "next/link";

const initial = { height: 70, width: 54, branchAngle: 48, internode: 52, leafWidth: 42, flowerDensity: 60 };
type Trait = keyof typeof initial;
const provisional = { height: 80, width: 48, branchAngle: 38, internode: 56, leafWidth: 42, flowerDensity: 68 };
const pilotSource = "https://growdiaries.com/diaries/223385-sour-diesel-grow-journal-by-budhunter/week/1282387?lnk=0";
const fields: { key: Trait; label: string; low: string; high: string }[] = [
  { key: "height", label: "Relative height", low: "Short", high: "Tall" },
  { key: "width", label: "Canopy width", low: "Narrow", high: "Wide" },
  { key: "branchAngle", label: "Branch spread", low: "Upright", high: "Open" },
  { key: "internode", label: "Internode spacing", low: "Tight", high: "Long" },
  { key: "leafWidth", label: "Leaflet width", low: "Narrow", high: "Broad" },
  { key: "flowerDensity", label: "Flower distribution", low: "Sparse", high: "Dense" },
];

export default function ReferenceStudio() {
  const [traits, setTraits] = useState(initial);
  const [reference, setReference] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const [bounds, setBounds] = useState({ left: 20, right: 80, top: 10, bottom: 90 });
  const [boundsConfirmed, setBoundsConfirmed] = useState(false);
  const measuredRatio = (bounds.right - bounds.left) / Math.max(1, bounds.bottom - bounds.top);
  const [calibration, setCalibration] = useState<"unmeasured" | "provisional" | "manual">("unmeasured");
  const h = 180 + traits.height * 2;
  const spread = 35 + traits.width * 1.25;
  const branchRise = 20 + (100 - traits.branchAngle) * .75;
  const n = Math.max(2, Math.round(2 + traits.flowerDensity / 16));
  const branches = Array.from({ length: n }, (_, i) => {
    const y = 370 - i * (h - 65) / (n + 1);
    const side = i % 2 ? 1 : -1;
    const x = 250 + side * spread * (0.6 + (i % 3) * .12);
    return { x, y, side, stemY: y + branchRise };
  });
  return <main className="min-h-screen bg-[#091711] px-4 py-10 text-[#f2f7ee]">
    <div className="mx-auto max-w-6xl">
      <Link href="/living-lineage" className="text-sm text-[#b5d6b7] underline">← Living Lineage</Link>
      <p className="mt-8 text-xs uppercase tracking-[.22em] text-[#a9c9aa]">Reference reconstruction lab · prototype</p>
      <h1 className="mt-2 text-4xl font-semibold">Plant structure studio</h1>
      <p className="mt-4 max-w-3xl text-[#bed1c0]">Compare a documented plant photograph with a configurable botanical silhouette. These controls describe one photographed phenotype, not a cultivar's universal appearance. No image is uploaded or saved.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr_320px]">
        <section className="rounded-2xl border border-[#47664e] bg-[#14281c] p-4">
          <h2 className="text-lg font-semibold">1 · Reference photo</h2>
          <p className="mt-2 text-sm text-[#b9cfbd]">Choose a full-plant image on your device. It stays in this browser session.</p>
          <div className="mt-4 rounded-xl border border-[#68876c] p-3 text-sm"><p className="font-semibold">Pilot: Barney’s Farm Sour Diesel · Budhunter</p><p className="mt-1 text-[#b9cfbd]">Grower-reported seed line, not verified ECSD. Image permissions and exact full-plant framing remain unverified.</p><a href={pilotSource} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline">Inspect original grow journal ↗</a></div>
          <button type="button" className="mt-3 rounded-lg border border-[#8ba98c] px-4 py-2 text-sm" onClick={() => { setTraits(provisional); setCalibration("provisional"); setSourceNotes("Provisional interpretation of grower narrative: relatively tall plant, dominant central cola, lateral branches less developed; LST, defoliation and lollipopping documented. NOT measured from image pixels. Review individual frames before using as reference geometry."); }}>Load provisional Sour Diesel shape</button>
          <label className="mt-5 block cursor-pointer rounded-xl border border-dashed border-[#7a9b7d] p-4 text-center text-sm">Select local image
            <input type="file" accept="image/*" className="sr-only" onChange={e => {
              const file = e.target.files?.[0]; if (!file) return;
              if (reference) URL.revokeObjectURL(reference);
              setReference(URL.createObjectURL(file)); setFileName(file.name); setBoundsConfirmed(false);
            }} />
          </label>
          <label className="mt-4 block text-sm">Photo observation notes<textarea rows={3} value={sourceNotes} onChange={e=>setSourceNotes(e.target.value)} placeholder="Specific week/frame, branch shape, training, image attribution..." className="mt-2 w-full rounded-lg border border-[#68876c] bg-[#07110a] p-3"/></label>
          {reference && <div className="mt-4 rounded-xl border border-[#68876c] p-3"><p className="text-sm font-semibold">Manual plant bounding box</p><p className="mt-1 text-xs text-[#b9cfbd]">Set boundaries as percentages of the entire image, excluding the pot and background. Use only when the whole plant is visible.</p>{(["left","right","top","bottom"] as const).map(key => <label key={key} className="mt-2 block text-xs capitalize">{key}: {bounds[key]}%<input type="range" min="0" max="100" value={bounds[key]} onChange={e=>{setBounds(prev=>({...prev,[key]:Number(e.target.value)}));setBoundsConfirmed(false);}} className="w-full accent-[#9bcd9b]"/></label>)}<p className="mt-2 text-sm">Image-space canopy width ÷ height: <strong>{bounds.left < bounds.right && bounds.top < bounds.bottom ? measuredRatio.toFixed(2) : "Invalid bounds"}</strong></p><label className="mt-2 flex gap-2 text-xs"><input type="checkbox" checked={boundsConfirmed} disabled={bounds.left >= bounds.right || bounds.top >= bounds.bottom} onChange={e=>setBoundsConfirmed(e.target.checked)}/>I inspected the image and positioned the bounds manually</label></div>}
          <div className="relative mt-4 flex min-h-[340px] items-center justify-center overflow-hidden rounded-xl bg-[#07110a]">
            {reference ? <img src={reference} alt={`Selected plant reference: ${fileName}`} className="max-h-[520px] w-full object-contain" /> : <p className="px-6 text-center text-sm text-[#a7c2a9]">No reference selected. Use a full-plant side view for the first comparison.</p>}
          </div>
        </section>
        <section className="rounded-2xl border border-[#47664e] bg-[#14281c] p-4">
          <h2 className="text-lg font-semibold">2 · Adjustable silhouette</h2>
          <p className="mt-2 text-sm text-[#b9cfbd]">Illustrative 2D geometry, not a photo-derived or 3D reconstruction.</p>
          <svg viewBox="0 0 500 480" role="img" aria-label="Adjustable botanical plant silhouette" className="mt-4 w-full rounded-xl bg-[#07110a]">
            <path d="M250 440 V370" stroke="#92b87a" strokeWidth="10" strokeLinecap="round"/>
            <path d={`M250 440 Q242 ${440-h*.55} 250 ${440-h}`} stroke="#92b87a" strokeWidth="9" fill="none" strokeLinecap="round"/>
            {branches.map(({x,y,side,stemY},i) => <g key={i}>
              <path d={`M250 ${stemY} Q${250+side*spread*.4} ${stemY-30} ${x} ${y}`} stroke="#83a76f" strokeWidth="5" fill="none"/>
              <ellipse cx={x} cy={y-12} rx={10 + traits.leafWidth*.12} ry={24 + traits.flowerDensity*.13} fill="#709a64" stroke="#b5d8a0" strokeWidth="2"/>
              <ellipse cx={x-side*18} cy={y+14} rx={5+traits.leafWidth*.1} ry={21} transform={`rotate(${side*30} ${x-side*18} ${y+14})`} fill="#3f794d"/>
            </g>)}
            <ellipse cx="250" cy={440-h} rx={14+traits.leafWidth*.08} ry={22+traits.flowerDensity*.22} fill="#9cbe7a" stroke="#d0e7a3" strokeWidth="2"/>
            <path d="M130 442 H370" stroke="#516958" strokeWidth="2"/>
          </svg>
          <p className="mt-3 text-xs text-[#b9cfbd]">Calibration status: {calibration === "provisional" ? "Provisional narrative-based estimate; no pixel measurements" : calibration === "manual" ? "Manually adjusted; not independently verified" : "Unmeasured demonstration"}</p>
          <p className="mt-3 text-xs text-[#b9cfbd]">Geometry is intentionally simplified to test proportions before building a reusable 3D model.</p>
        </section>
        <section className="rounded-2xl border border-[#47664e] bg-[#14281c] p-5">
          <h2 className="text-lg font-semibold">3 · Match the structure</h2>
          <div className="mt-5 space-y-5">{fields.map(f => <label key={f.key} className="block">
            <span className="flex justify-between gap-3 text-sm"><span>{f.label}</span><span className="tabular-nums text-[#bbd5ba]">{traits[f.key]}%</span></span>
            <input aria-label={f.label} type="range" min="0" max="100" value={traits[f.key]} onChange={e=>{setTraits(t=>({...t,[f.key]:Number(e.target.value)}));setCalibration("manual");}} className="mt-2 w-full accent-[#9bcd9b]"/>
            <span className="flex justify-between text-xs text-[#a9c4ae]"><span>{f.low}</span><span>{f.high}</span></span>
          </label>)}</div>
          <button type="button" className="mt-6 w-full rounded-xl border border-[#7d9e7e] px-4 py-3 text-sm" onClick={()=>{setTraits(initial);setCalibration("unmeasured");}}>Reset proportions</button>
          <button type="button" className="mt-3 w-full rounded-xl bg-[#cde8bd] px-4 py-3 text-sm font-semibold text-[#173020]" onClick={()=>{const data={schemaVersion:1,subject:"Photographed plant phenotype",referenceFile:fileName||null,sourcePage:pilotSource,sourceNotes,manualImageBounds:reference && boundsConfirmed ? bounds : null,measuredImageWidthHeightRatio:reference && boundsConfirmed ? measuredRatio : null,calibrationStatus:calibration,measurementMethod:calibration==="provisional"?"Grower narrative, not image measurements":calibration==="manual"?"Manual slider adjustment":"None",rights:"unverified",identity:"grower-reported Barney’s Farm Sour Diesel",traits,limitations:"Illustrative user-adjusted 2D approximation; not verified 3D morphology or cultivar identity."};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="cannagraph-plant-reference.json";a.click();URL.revokeObjectURL(url);}}>Export structure settings</button>
        </section>
      </div>
    </div>
  </main>;
}
