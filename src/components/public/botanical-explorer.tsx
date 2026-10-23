"use client";

import { useState } from "react";
import Link from "next/link";

const families = [
  { id: "skunk", name: "Skunk", x: 170, y: 180, note: "Explore the history of Skunk selections and their documented breeders." },
  { id: "haze", name: "Haze", x: 300, y: 105, note: "Trace Original Haze stories, archival material, and later selections." },
  { id: "chemdog", name: "Chemdog", x: 430, y: 180, note: "Examine the accounts surrounding Chemdog and its influential selections." },
  { id: "sour-diesel", name: "Sour Diesel", x: 200, y: 325, note: "Compare the competing historical accounts of Sour Diesel." },
  { id: "og-kush", name: "OG Kush", x: 400, y: 325, note: "Explore competing OG Kush histories and named cuts." },
] as const;

type FamilyId = (typeof families)[number]["id"];

export function BotanicalExplorer() {
  const [selected, setSelected] = useState<FamilyId>("haze");
  const [zen, setZen] = useState(false);
  const active = families.find((family) => family.id === selected) ?? families[1];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
      <div className="overflow-hidden rounded-3xl border border-[#33473a] bg-[#17231d] p-4 text-[#f2f0e6] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#bed0b6]">Botanical navigation study</p>
          <button type="button" aria-pressed={zen} onClick={() => setZen((value) => !value)}
            className="rounded-full border border-[#718a74] px-4 py-2 text-sm hover:bg-[#2e4234]">
            {zen ? "Pause gentle motion" : "Enable gentle motion"}
          </button>
        </div>
        <svg viewBox="0 0 600 460" role="img" aria-label="Stylized cannabis plant with five selectable bud clusters" className={zen ? "mt-4 w-full motion-safe:animate-[pulse_7s_ease-in-out_infinite]" : "mt-4 w-full"}>
          <defs>
            <linearGradient id="plantStem" x1="0" x2="1" y1="1" y2="0"><stop stopColor="#597451" /><stop offset="1" stopColor="#b2c38d" /></linearGradient>
          </defs>
          <path d="M300 460 Q295 340 300 250 Q260 205 170 180 M300 250 Q340 205 430 180 M300 350 Q255 330 200 325 M300 350 Q345 330 400 325 M300 250 L300 105"
            fill="none" stroke="url(#plantStem)" strokeWidth="9" strokeLinecap="round" />
          {families.map((family) => (
            <g key={family.id}>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <ellipse key={angle} cx={family.x} cy={family.y - 17} rx="10" ry="22"
                  transform={`rotate(${angle} ${family.x} ${family.y})`}
                  fill={family.id === selected ? "#b7c98c" : "#6f926e"} opacity=".85" />
              ))}
              <circle cx={family.x} cy={family.y} r="12" fill="#d4c48c" />
              <text x={family.x} y={family.y + 47} fill="#f2f0e6" fontSize="15" textAnchor="middle">{family.name}</text>
            </g>
          ))}
          <path d="M300 455 L300 430" stroke="#a2b88c" strokeWidth="12" strokeLinecap="round" />
        </svg>
        <p className="mt-3 text-center text-xs text-[#bed0b6]">Artistic navigation metaphor — not a genetic family tree or a representation of cultivar morphology.</p>
      </div>
      <section className="self-start rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Choose a bud cluster</p>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Genetic family navigation">
          {families.map((family) => (
            <button key={family.id} type="button" onClick={() => setSelected(family.id)}
              aria-pressed={selected === family.id}
              className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline ${selected === family.id ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--line)] hover:bg-[var(--surface-muted)]"}`}>
              {family.name}
            </button>
          ))}
        </div>
        <h2 className="mt-9 text-3xl font-semibold tracking-tight">{active.name}</h2>
        <p className="mt-4 leading-7 text-[var(--muted)]">{active.note}</p>
        <div className="mt-7 border-t border-[var(--line)] pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--warning)]">Research awaiting publication</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            This cluster is a navigation concept. No verified cultivar profile, historical media, or parent-child relationship is published for it yet.
          </p>
          <Link href={`/search?q=${encodeURIComponent(active.name)}`}
            className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white hover:opacity-90">
            Search published archive →
          </Link>
        </div>
        <p className="mt-7 text-xs leading-5 text-[var(--muted)]">Audio is not included in this prototype. No music plays automatically.</p>
      </section>
    </div>
  );
}
