import Link from "next/link";

import { SearchBox } from "@/components/public/search-box";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--canvas)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center gap-5 px-5 py-3 sm:px-8 lg:px-12">
          <Link href="/" className="shrink-0 font-mono text-sm font-bold uppercase tracking-[0.2em] sm:text-base" aria-label="Cannagraph home">
            Canna<span className="text-[var(--accent)]">graph</span>
          </Link>
          <div className="ml-auto hidden flex-1 justify-center md:flex"><SearchBox compact /></div>
          <nav aria-label="Primary navigation" className="ml-auto flex items-center gap-1 text-sm md:ml-0">
            <Link href="/cultivars" className="rounded-full px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]">Cultivars</Link>
            <Link href="/search" className="rounded-full px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)] md:hidden">Search</Link>
            <span className="hidden rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--muted)] sm:inline-flex">Public beta</span>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--line)] bg-[var(--surface-muted)]">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-10 sm:px-8 md:grid-cols-2 lg:px-12">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">Cannagraph Research Archive</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">A source-backed record of cannabis genetics that keeps uncertainty, disagreement, and provenance visible.</p>
          </div>
          <div className="flex gap-6 text-sm text-[var(--muted)] md:justify-end">
            <Link href="/cultivars" className="hover:text-[var(--ink)]">Cultivars</Link>
            <Link href="/search" className="hover:text-[var(--ink)]">Search</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
