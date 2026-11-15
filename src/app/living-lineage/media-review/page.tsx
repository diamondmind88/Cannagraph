"use client";

import Link from "next/link";
import { useState } from "react";
import { sourDieselMediaCandidates } from "@/lib/living-lineage/media-candidates";

type Decision = "unreviewed" | "shortlist" | "reject";

export default function MediaReviewPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const reviewed = Object.values(decisions).filter(x => x !== "unreviewed").length;
  function exportReview() {
    const payload = {
      version: 1,
      cultivar: "Sour Diesel",
      exportedAt: new Date().toISOString(),
      records: sourDieselMediaCandidates.map(c => ({
        id: c.id, sourcePage: c.sourcePage, reportedLine: c.reportedLine,
        rights: c.rights, identity: c.identity,
        decision: decisions[c.id] ?? "unreviewed", reviewerNotes: notes[c.id] ?? ""
      }))
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "cannagraph-sour-diesel-media-review.json"; a.click();
    URL.revokeObjectURL(url);
  }
  return <main className="min-h-screen bg-[#0b1712] px-5 py-12 text-[#eef5eb]">
    <div className="mx-auto max-w-4xl">
      <Link href="/living-lineage" className="text-sm text-[#b4d7b8] underline">← Living Lineage</Link>
      <p className="mt-9 text-xs uppercase tracking-[.24em] text-[#a2c6a6]">Research media · manual review</p>
      <h1 className="mt-3 text-4xl font-semibold">Sour Diesel photo candidates</h1>
      <p className="mt-4 max-w-3xl text-[#c3d5c6]">Inspect external grow journals and source pages before selecting a reference. No photos are scraped, copied, or published here. All source rights are unverified; shortlist does not grant reuse permission.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <span>{reviewed} of {sourDieselMediaCandidates.length} reviewed in this session</span>
        <button onClick={exportReview} type="button" className="rounded-xl bg-[#cde8bd] px-5 py-3 font-semibold text-[#173020]">Export review JSON</button>
        <Link className="underline" href="/living-lineage/reference-studio">Open structure studio</Link>
      </div>
      <div className="mt-8 space-y-4">
        {sourDieselMediaCandidates.map(c => <article key={c.id} className="rounded-2xl border border-[#45654a] bg-[#182c20] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-xl font-semibold">{c.sourceName}</h2><p className="mt-1 text-sm text-[#b7cfbb]">{c.reportedLine}</p></div>
            <span className="rounded-full border border-[#8aa78e] px-3 py-1 text-xs">Rights: {c.rights}</span>
          </div>
          <p className="mt-3 text-sm text-[#c3d5c6]">{c.notes}</p>
          <p className="mt-2 text-xs text-[#aac3af]">Views: {c.view} · Training: {c.training} · Identity: {c.identity}</p>
          <a href={c.sourcePage} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-[#d0e8c5] underline">Inspect original source ↗</a>
          <fieldset className="mt-5">
            <legend className="text-sm font-medium">Review decision</legend>
            <div className="mt-2 flex flex-wrap gap-4">{(["unreviewed","shortlist","reject"] as const).map(choice => <label key={choice} className="flex items-center gap-2 text-sm"><input type="radio" name={c.id} checked={(decisions[c.id] ?? "unreviewed") === choice} onChange={()=>setDecisions(prev=>({...prev,[c.id]:choice}))} />{choice}</label>)}</div>
          </fieldset>
          <label className="mt-4 block text-sm">Source and morphology notes
            <textarea value={notes[c.id] ?? ""} onChange={e=>setNotes(prev=>({...prev,[c.id]:e.target.value}))} rows={2} placeholder="Image author, plant stage, visible structure, permission status..." className="mt-2 w-full rounded-lg border border-[#68876c] bg-[#0b1712] p-3 text-[#eef5eb]"/>
          </label>
        </article>)}
      </div>
      <p className="mt-8 text-xs text-[#a7bca9]">Review decisions exist only in this browser session until exported. This page is not connected to a write-enabled research database.</p>
    </div>
  </main>;
}
