import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const principles = [
  ["Source-backed", "Every material claim is designed to retain its evidence and provenance."],
  ["Conflict-preserving", "Competing histories remain visible instead of being silently overwritten."],
  ["Identity-aware", "Names are searchable labels—not proof that two cultivars are the same entity."],
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <section className="grid gap-10 border-b border-[var(--line)] pb-16 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <Badge tone="supported">Foundation active</Badge>
          <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            Cannabis genetics, documented like history matters.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)]">
            Cannagraph is becoming a continuously evolving research network for cultivars, cuts, breeders, lineage,
            sources, claims, and the evidence connecting them.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)]">
          <div className="bg-[var(--surface)] p-5">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Current slice</dt>
            <dd className="mt-2 text-2xl font-semibold">00</dd>
          </div>
          <div className="bg-[var(--surface)] p-5">
            <dt className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Canonical facts</dt>
            <dd className="mt-2 text-2xl font-semibold">Evidence first</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="principles-title" className="py-14">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 id="principles-title" className="text-2xl font-semibold tracking-tight">Research principles</h2>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Foundation preview</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map(([title, description], index) => (
            <Card key={title} eyebrow={`0${index + 1}`} title={title}>
              {description}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
