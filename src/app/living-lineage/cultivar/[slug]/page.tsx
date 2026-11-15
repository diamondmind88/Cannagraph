import Link from "next/link";
import { getPublicCultivarResearch } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function LivingLineageCultivarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getPublicCultivarResearch(slug);
  if (!record) {
    return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-3xl font-semibold">Cultivar not available</h1><p className="mt-4">Only published archive records appear in the living explorer.</p><Link href="/cultivars" className="mt-6 inline-block underline">Browse published cultivars</Link></main>;
  }
  const { entity, lineage, descendants } = record;
  return <main className="min-h-screen bg-[#0b1712] px-5 py-12 text-[#f1f6ee]">
    <div className="mx-auto max-w-4xl">
      <Link href="/living-lineage" className="text-sm text-[#b8d5ba] underline">← Living Lineage</Link>
      <p className="mt-10 text-xs uppercase tracking-[.24em] text-[#a2c6a6]">Published archive · Living Lineage</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{entity.canonicalName}</h1>
      <p className="mt-4 max-w-xl text-[#c3d5c6]">{entity.description ?? "Explore documented relationships for this cultivar."}</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <section className="rounded-2xl border border-[#44634a] bg-[#172b20] p-6">
          <h2 className="text-xl font-semibold">Reported parents</h2>
          <p className="mt-2 text-sm text-[#b5cbb9]">Each connection retains its evidence status; no claim is treated as proven solely because it appears here.</p>
          {lineage.length === 0 ? <p className="mt-6 text-sm">No published parent relationships available.</p> : <ul className="mt-6 space-y-4">{lineage.map(edge => <li key={edge.id} className="border-t border-[#3d5c46] pt-4">
            {edge.parent?.slug ? <Link className="font-semibold underline" href={`/living-lineage/cultivar/${encodeURIComponent(edge.parent.slug)}`}>{edge.parent.canonicalName}</Link> : <span className="font-semibold">Parent record unavailable</span>}
            <p className="mt-1 text-xs text-[#bbd2bd]">Role: {edge.parent_role ?? "unspecified"} · Status: {edge.status} · Confidence: {edge.confidence ?? "not rated"}</p>
            <p className="mt-1 text-xs text-[#bbd2bd]">Evidence documents: {edge.evidence.length}</p>
          </li>)}</ul>}
        </section>
        <section className="rounded-2xl border border-[#44634a] bg-[#172b20] p-6">
          <h2 className="text-xl font-semibold">Reported descendants</h2>
          <p className="mt-2 text-sm text-[#b5cbb9]">Navigate forward through the published genetic network.</p>
          {descendants.length === 0 ? <p className="mt-6 text-sm">No published descendant relationships available.</p> : <ul className="mt-6 space-y-4">{descendants.map(edge => <li key={edge.id} className="border-t border-[#3d5c46] pt-4">
            {edge.child?.slug ? <Link className="font-semibold underline" href={`/living-lineage/cultivar/${encodeURIComponent(edge.child.slug)}`}>{edge.child.canonicalName}</Link> : <span className="font-semibold">Descendant record unavailable</span>}
            <p className="mt-1 text-xs text-[#bbd2bd]">Status: {edge.status} · Confidence: {edge.confidence ?? "not rated"}</p>
          </li>)}</ul>}
        </section>
      </div>
      <Link className="mt-8 inline-block text-sm underline" href={`/cultivars/${encodeURIComponent(slug)}`}>View complete evidence and source documents →</Link>
      <p className="mt-10 text-xs text-[#a5bca9]">The animated plant interface is experimental. This view reads real published Supabase records and does not manufacture missing relationships.</p>
    </div>
  </main>;
}
