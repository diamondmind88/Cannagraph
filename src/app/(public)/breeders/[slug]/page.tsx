import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getPublicEntityBySlug } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entity = await getPublicEntityBySlug("breeder", (await params).slug);
  return { title: entity ? `${entity.canonicalName} — Cannagraph` : "Breeder not found — Cannagraph" };
}

export default async function BreederPage({ params }: { params: Promise<{ slug: string }> }) {
  const entity = await getPublicEntityBySlug("breeder", (await params).slug);
  if (!entity) notFound();
  return <article className="mx-auto min-h-[70vh] max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"><Badge tone="supported">Published breeder</Badge><h1 className="mt-6 text-balance text-5xl font-semibold leading-none tracking-[-0.055em] sm:text-7xl">{entity.canonicalName}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{entity.description ?? "This breeder record has no public narrative summary yet."}</p><dl className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"><div className="bg-[var(--surface)] p-6"><dt className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Permanent ID</dt><dd className="mt-2 font-mono">{entity.publicId}</dd></div><div className="bg-[var(--surface)] p-6"><dt className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Publication</dt><dd className="mt-2">Canonical public record</dd></div></dl></article>;
}
