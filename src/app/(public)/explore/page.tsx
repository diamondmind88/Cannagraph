import Link from "next/link";
import { BotanicalExplorer } from "@/components/public/botanical-explorer";

export const metadata = {
  title: "Living Cannabis Explorer | CannaGraph",
  description: "A botanical gateway into CannaGraph's evidence-aware cannabis history archive.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8 sm:py-20 lg:px-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Experimental explorer · prototype</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">The living lineage.</h1>
      <p className="mt-5 mb-10 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        A quiet botanical doorway into cannabis history. Select a bud family to explore its story.
        This first interactive study is illustrative; factual relationships will appear only after source review and publication.
      </p>
      <BotanicalExplorer />
      <div className="mt-10 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]">
        Prefer the historical archive? <Link href="/cultivars" className="font-medium text-[var(--accent)] underline">Browse published cultivars</Link>.
      </div>
    </div>
  );
}
