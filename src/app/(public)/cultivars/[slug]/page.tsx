import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getPublicEntityBySlug } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entity = await getPublicEntityBySlug("cultivar", (await params).slug);
  return { title: entity ? `${entity.canonicalName} — Cannagraph` : "Cultivar not found — Cannagraph" };
}

export default async function CultivarPage({ params }: { params: Promise<{ slug: string }> }) {
  const entity = await getPublicEntityBySlug("cultivar", (await params).slug);
  if (!entity) notFound();

  return (
    <article className="mx-auto min-h-[70vh] max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <header className="grid gap-10 border-b border-[var(--line)] pb-12 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div><Badge tone="supported">Published cultivar</Badge><h1 className="mt-6 text-balance text-5xl font-semibold leading-none tracking-[-0.055em] sm:text-7xl">{entity.canonicalName}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{entity.description ?? "This canonical identity has no public narrative summary yet."}</p></div>
        <dl className="border-l border-[var(--line-strong)] pl-6"><dt className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">Permanent record ID</dt><dd className="mt-2 font-mono text-sm">{entity.publicId}</dd><dt className="mt-6 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">Record type</dt><dd className="mt-2 text-sm capitalize">{entity.entityType}</dd></dl>
      </header>
      <section className="grid gap-6 py-12 md:grid-cols-3">{["Identity", "Lineage", "Evidence"].map((title) => <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6" key={title}><p className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--accent)]">Research section</p><h2 className="mt-8 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Detailed {title.toLowerCase()} research arrives in the next focused build slice.</p></div>)}</section>
    </article>
  );
}
