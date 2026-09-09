import Link from "next/link";

import { EmptyState } from "@/components/public/empty-state";
import { EntityRow } from "@/components/public/entity-row";
import { SearchBox } from "@/components/public/search-box";
import { Badge } from "@/components/ui/badge";
import { getPublicEntities, getPublicStats } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, recentCultivars] = await Promise.all([getPublicStats(), getPublicEntities("cultivar", 5)]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div aria-hidden="true" className="archive-orbit" />
        <div className="mx-auto grid min-h-[42rem] max-w-[90rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:px-12">
          <div className="relative z-10">
            <Badge tone="supported">Open research archive</Badge>
            <h1 className="mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[0.91] tracking-[-0.065em] sm:text-7xl lg:text-[6.4rem]">
              Cannabis history,<br /><span className="font-serif font-normal italic text-[var(--accent)]">with receipts.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)]">
              Explore a living record of cultivars, breeders, names, lineage claims, and the evidence behind them—without flattening disputed histories into false certainty.
            </p>
            <div className="mt-9"><SearchBox /></div>
          </div>
          <aside className="relative z-10 border-l border-[var(--line-strong)] pl-6">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">Archive principle 01</p>
            <blockquote className="mt-5 font-serif text-2xl leading-9 text-[var(--ink-soft)]">“A familiar name is a clue, not proof of identity.”</blockquote>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Aliases remain searchable while distinct cuts, phenotypes, and seed lines remain distinct records.</p>
          </aside>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--ink)] text-[#f4f1e8]">
        <dl className="mx-auto grid max-w-[90rem] grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([label, value]) => (
            <div key={label} className="border-r border-white/10 px-5 py-7 last:border-r-0 sm:px-8 lg:px-12">
              <dt className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-white/50">Published {label}</dt>
              <dd className="mt-2 text-3xl font-semibold tabular-nums">{value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)]">Recently published</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Cultivar records</h2>
          </div>
          <Link href="/cultivars" className="hidden text-sm font-medium text-[var(--accent)] hover:underline sm:block">Browse the index →</Link>
        </div>
        {recentCultivars.length > 0 ? (
          <div className="border-t border-[var(--line)]">{recentCultivars.map((entity) => <EntityRow entity={entity} key={entity.id} />)}</div>
        ) : (
          <EmptyState title="The public index is being prepared" description="The canonical database is live, but no cultivar has passed the publication workflow yet. Cannagraph shows this honestly instead of filling the archive with placeholder records." />
        )}
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-[90rem] gap-px bg-[var(--line)] md:grid-cols-3">
          {[
            ["01", "Trace the source", "Material claims retain the document, retrieval context, and relationship to other sources."],
            ["02", "Preserve conflict", "Supported and disputed histories can coexist while the evidence remains inspectable."],
            ["03", "Resolve identity", "Similarity creates a review candidate—never an automatic merge of canonical records."],
          ].map(([number, title, copy]) => (
            <article key={number} className="bg-[var(--surface)] p-8 sm:p-10">
              <p className="font-mono text-xs text-[var(--accent)]">{number}</p>
              <h3 className="mt-10 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
