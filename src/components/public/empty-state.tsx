import Link from "next/link";

export function EmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-muted)] px-6 py-14 text-center sm:px-10">
      <div className="mx-auto mb-5 grid size-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] font-mono text-sm text-[var(--accent)]">∅</div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--muted)]">{description}</p>
      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">
        Return to the archive
      </Link>
    </div>
  );
}
