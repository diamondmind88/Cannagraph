import Link from "next/link";
import { getPublicEntities } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function LivingLineageArchivePage() {
  const cultivars = await getPublicEntities("cultivar", 100);
  return <main className="min-h-screen bg-[#0b1712] px-5 py-12 text-[#eff6ee]">
    <div className="mx-auto max-w-4xl">
      <Link href="/living-lineage" className="text-sm text-[#b8d5ba] underline">← Interactive prototype</Link>
      <p className="mt-10 text-xs uppercase tracking-[.24em] text-[#a2c6a6]">Live published archive</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Explore real cultivars</h1>
      <p className="mt-5 max-w-2xl text-[#c3d5c6]">Only published canonical records appear here. Unpublished research remains protected by the archive's existing access rules.</p>
      {cultivars.length === 0 ? <div className="mt-10 rounded-2xl border border-[#45654a] bg-[#182c20] p-8"><h2 className="text-xl font-semibold">No published cultivars yet</h2><p className="mt-3 text-[#c3d5c6]">The research archive may contain unpublished records, but none are available through the public explorer. The visual demo remains available while records are reviewed for publication.</p><Link href="/living-lineage" className="mt-6 inline-block underline">Return to the interactive demonstration</Link></div> :
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">{cultivars.map(c => <li key={c.id}><Link href={`/living-lineage/cultivar/${encodeURIComponent(c.slug ?? "")}`} className="block rounded-xl border border-[#45654a] bg-[#182c20] p-5 hover:bg-[#25442e] focus-visible:outline-2 focus-visible:outline-offset-2"><span className="block text-lg font-semibold">{c.canonicalName}</span><span className="mt-2 block text-xs text-[#bbd2bd]">{c.publicId}</span></Link></li>)}</ul>}
    </div>
  </main>;
}
