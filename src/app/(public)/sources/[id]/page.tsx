import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getPublicSource } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const record = await getPublicSource((await params).id);
  if (!record) notFound();
  const { source, documents } = record;
  return <article className="mx-auto min-h-[70vh] max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"><Badge>Source record</Badge><h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-none tracking-[-0.045em] sm:text-6xl">{source.title}</h1><p className="mt-5 text-lg text-[var(--muted)]">{source.publisher ?? "Publisher not recorded"} · {source.sourceType.replaceAll("_", " ")}</p>{source.canonicalUrl && <a href={source.canonicalUrl} rel="noreferrer" target="_blank" className="mt-6 inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">Visit original source ↗</a>}<section className="mt-14"><div className="flex items-baseline justify-between border-b border-[var(--line)] pb-4"><h2 className="text-2xl font-semibold">Captured documents</h2><span className="font-mono text-xs text-[var(--muted)]">{documents.length} records</span></div>{documents.map((document) => <div className="grid gap-3 border-b border-[var(--line)] py-6 sm:grid-cols-[1fr_auto]" key={document.id}><div><h3 className="font-semibold">{document.title ?? "Untitled source document"}</h3><p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">{document.relationship_type}</p></div>{document.document_url && <a href={document.document_url} rel="noreferrer" target="_blank" className="text-sm text-[var(--accent)] hover:underline">Open document ↗</a>}</div>)}</section></article>;
}
