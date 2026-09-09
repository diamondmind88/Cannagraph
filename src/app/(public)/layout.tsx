import Link from "next/link";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[color:var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.22em]">
            Cannagraph
          </Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-5 text-sm text-[var(--muted)]">
            <span aria-disabled="true">Research</span>
            <span aria-disabled="true">Sources</span>
            <span className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[var(--ink)]">Public beta</span>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
